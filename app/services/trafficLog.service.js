const {
  Spot,
  SpotConstraint,
  SpotCopy,
  TrafficLogEntry,
} = require("../models");
const { datastore } = require("../db");
const { DateTime } = require("luxon");
const stringify = require("csv-stringify/lib/sync");

async function getTrafficLogEntries(dow, hour) {
  const since = new Date();
  since.setDate(since.getDate() - 1);
  const { entities: entries } = await TrafficLogEntry.list({
    filters: [
      ["created", ">", since],
      ["dow", dow],
      ["hour", hour],
    ],
    showKey: true,
  }).populate(["spot", "spot_copy"]);
  return entries.flat();
}

async function getConstraints(dow, hour) {
  const { entities: constraints } = await SpotConstraint.query()
    .filter("dow", dow)
    .filter("hour", hour)
    .run();
  return constraints;
}

function uniqueSpotKeysAtConstraints(constraints) {
  const keyMap = new Map();
  constraints.forEach((constraint) => {
    constraint.spots?.forEach((spot) => {
      keyMap.set(spot.id, spot);
    });
  });
  return Array.from(keyMap.values());
}

async function getActiveCopyForSpot(key) {
  const promises = [
    await SpotCopy.list({
      filters: [
        ["spot", key],
        ["expire_on", null],
      ],
      showKey: true,
    }),
    await SpotCopy.list({
      filters: [
        ["spot", key],
        ["expire_on", ">", new Date()],
      ],
      showKey: true,
    }),
  ];
  const results = await Promise.all(promises);
  const copy = results.reduce(
    (previous, current) => previous.concat(current.entities),
    []
  );
  const spotId = parseInt(key.id, 10);
  return { spotId, copy };
}

async function getActiveSpotsAndCopy(spotKeys) {
  const spotIds = spotKeys.map((key) => parseInt(key.id, 10));
  const spots = await Spot.get(spotIds);
  const activeSpots = spots.filter((spot) => spot.active && !spot.deleted);
  const activeSpotKeys = activeSpots.map((spot) => spot.entityKey);
  const promises = activeSpotKeys.map(
    async (key) => await getActiveCopyForSpot(key)
  );
  const allCopy = await Promise.all(promises);
  const spotsAndCopy = allCopy.reduce((acc, { spotId, copy }) => {
    acc[spotId] = {
      copy,
      spot: spots.find((spot) => spot.id == spotId),
    };
    return acc;
  }, {});
  return spotsAndCopy;
}

function copyIsRunning(copy) {
  if (!copy.start_on && !copy.expire_on) {
    return true;
  }

  const now = new Date();
  let started = true;
  let expired = false;
  if (copy.start_on) {
    const startDate = new Date(copy.start_on);
    started = now > startDate;
  }
  if (copy.expire_on) {
    const endDate = new Date(copy.expire_on);
    expired = now > endDate;
  }

  return started && !expired;
}

function buildEntry(constraint, copy) {
  let spot;
  if (copy) {
    spot = copy.spot;
  }

  const entry = new TrafficLogEntry({
    dow: constraint.dow,
    hour: constraint.hour,
    slot: constraint.slot,
    spot: spot,
    scheduled: constraint[datastore.KEY],
    spot_copy: copy,
  });
  return entry.plain();
}

function buildEntries(existingEntries, constraints, spots, greylist) {
  const entries = [];
  for (const constraint of constraints) {
    if (!constraint.spots?.length) {
      continue;
    }

    for (const spotKey of constraint.spots) {
      const entry = existingEntries.find(
        (entry) =>
          entry.scheduled.name == constraint.id && entry.spot.id == spotKey.id
      );

      if (entry) {
        entries.push(entry);
      } else {
        const spotAndCopy = spots[spotKey.id];
        if (!spotAndCopy) {
          continue;
        }

        const runningCopy = spotAndCopy.copy.filter(copyIsRunning);

        let validCopy = runningCopy;
        if (runningCopy.length > 1) {
          validCopy = runningCopy.filter((copy) => !greylist.includes(copy.id));
        }

        if (validCopy.length) {
          const randomIndex = Math.floor(Math.random() * validCopy.length);
          const randomCopy = validCopy[randomIndex];
          randomCopy.spot = spotAndCopy.spot.plain({ showKey: true });
          entries.push(buildEntry(constraint, randomCopy));
        }
      }
    }
  }

  return entries;
}

async function getLog(dow, hour, greylist) {
  const existingEntries = await getTrafficLogEntries(dow, hour);
  const constraints = await getConstraints(dow, hour);
  const spotKeys = uniqueSpotKeysAtConstraints(constraints);
  const spots = await getActiveSpotsAndCopy(spotKeys);
  const entries = buildEntries(existingEntries, constraints, spots, greylist);
  return entries;
}

function checkForKey(prop, value) {
  if (datastore.isKey(value)) {
    return value;
  }

  let key;
  if (value.path) {
    key = datastore.key(value.path);
    if (datastore.isKey(key)) {
      return key;
    }
  }

  if (value.__key) {
    key = datastore.key([value.__key.kind, parseInt(value.__key.id, 10)]);
    if (datastore.isKey(key)) {
      return key;
    }
  }

  throw new Error(`Invalid key for property '${prop}''`);
}

async function addEntry(data, user) {
  data.spot = checkForKey("spot", data.spot);
  data.scheduled = checkForKey("scheduled", data.scheduled);
  data.spot_copy = checkForKey("spot_copy", data.spot_copy);
  data.reader = user;
  const now = new Date();
  data.readtime = now;

  // matches DJDB
  data.log_date = DateTime.now()
    .minus({ days: 1 })
    .setZone("America/Chicago")
    .set({ hour: 18, minute: 0, second: 0, millisecond: 0 })
    .toJSDate();

  const entry = new TrafficLogEntry(data);
  await entry.save();
  await entry.populate(["spot", "spot_copy"]);
  return entry.plain({ showKey: true });
}

function byReadTime(a, b) {
  if (a.readtime < b.readtime) {
    return -1;
  }
  if (b.readtime > a.readtime) {
    return 1;
  }
  return 0;
}

async function getReport(start, end, options = {}) {
  const { spotType, underwriter } = options;
  
  const { entities: entries } = await TrafficLogEntry.list({
    filters: [
      ["log_date", ">=", start],
      ["log_date", "<=", end],
    ],
  }).populate(["spot", "spot_copy"]);
  
  // Filter by spot type and underwriter at application level since they are nested fields
  let filteredEntries = entries;
  
  if (spotType) {
    filteredEntries = filteredEntries.filter(entry => 
      entry.spot && entry.spot.type === spotType
    );
  }
  
  if (underwriter) {
    filteredEntries = filteredEntries.filter(entry => 
      entry.spot_copy && 
      entry.spot_copy.underwriter && 
      entry.spot_copy.underwriter.toLowerCase().includes(underwriter.toLowerCase())
    );
  }

  const header = ["readtime", "dow", "slot_time", "underwriter", "title", "type", "excerpt"];
  
  const rows = filteredEntries.sort(byReadTime).map((entry) => {
    const fields = [];
    
    const dt = DateTime.fromJSDate(entry.readtime).setZone("America/Chicago");
    fields.push(dt.toFormat("yyyy-MM-dd HH:mm:ss"));
    
    fields.push(dt.weekdayLong);
        
    const slotTime = `${entry.hour.toString().padStart(2, '0')}:${entry.slot.toString().padStart(2, '0')}`;
    fields.push(slotTime);
        
    const underwriter = entry.spot_copy?.underwriter || "";
    fields.push(underwriter);
        
    fields.push(entry.spot?.title || "");
        
    fields.push(entry.spot?.type || "");
    
    const excerpt = entry.spot_copy?.body 
      ? entry.spot_copy.body.substring(0, 140)
      : "";
    fields.push(excerpt);
    
    return fields;
  });

  return stringify([header, ...rows]);
}

module.exports = {
  addEntry,
  getLog,
  getReport,
};
