const {
  Spot,
  SpotConstraint,
  SpotCopy,
  TrafficLogEntry,
} = require("../models");
const { datastore } = require("../db");
const { DateTime } = require("luxon");
const stringify = require("csv-stringify/lib/sync");
const DEFAULT_LOG_LENGTH = 3; // hours

function getNextDayAndHourPair(pair) {
  const [dow, hour] = [...pair];
  let newDow = dow;
  let newHour = hour + 1;
  if (newHour === 24) {
    newDow = dow + 1;
    newHour = 0;
  }
  if (newDow === 8) {
    newDow = 1;
  }

  return [newDow, newHour];
}

function createDayAndHourPairs(dow, hour, length) {
  const pairs = [[dow, hour]];
  for (let i = 1; i < length; i++) {
    pairs.push(getNextDayAndHourPair(pairs[i - 1]));
  }
  return pairs;
}

async function getTrafficLogEntries(dow, hour, since) {
  const { entities: entries } = await TrafficLogEntry.list({
    filters: [
      ["created", ">", since],
      ["dow", dow],
      ["hour", hour],
    ],
    showKey: true,
  }).populate(["spot", "spot_copy"]);
  return entries;
}

async function getTrafficLogEntriesForMultipleHours(pairs) {
  const since = new Date();
  since.setDate(since.getDate() - 1);
  const entryPromises = pairs.map(async (pair) => {
    return await getTrafficLogEntries(pair[0], pair[1], since);
  });
  const entries = await Promise.all(entryPromises);
  const flatEntries = entries.flat();
  return flatEntries;
}

async function getConstraints(dow, hour) {
  const { entities: constraints } = await SpotConstraint.query()
    .filter("dow", dow)
    .filter("hour", hour)
    .run();
  return constraints;
}

async function getMultipleConstraints(pairs) {
  const promises = pairs.map(async (pair) => {
    return await getConstraints(pair[0], pair[1]);
  });
  const constraints = await Promise.all(promises);
  return constraints.flat().filter((constraint) => {
    return Array.isArray(constraint.spots);
  });
}

function combineSpotKeysAtConstraints(constraints) {
  return constraints.reduce((previous, current) => {
    if (Array.isArray(current.spots)) {
      return previous.concat(current.spots);
    }
    return previous;
  }, []);
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
  return results.reduce(
    (previous, current) => previous.concat(current.entities),
    []
  );
}

async function getActiveCopy(spotKeys) {
  const promises = spotKeys.map(async (key) => await getActiveCopyForSpot(key));
  const copy = await Promise.all(promises);
  return copy.flat();
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

function findExistingEntryForConstraint(entries, constraint) {
  return entries.find((entry) => {
    return entry.scheduled.name == constraint.id;
  });
}

async function getRandomCopyForConstraint(copy, constraint) {
  const spotIds = constraint.spots.map((spot) => spot.id);
  const copyForConstraint = copy.filter((item) =>
    spotIds.includes(item.spot.id)
  );
  const runningCopy = copyForConstraint.filter(copyIsRunning);
  let randomCopy;
  let spot;
  if (runningCopy.length) {
    const randomIndex = Math.floor(Math.random() * runningCopy.length);
    randomCopy = runningCopy[randomIndex];
    spot = await Spot.get(parseInt(randomCopy.spot.id, 10));
    randomCopy.spot = spot.plain({ showKey: true });
  }
  return randomCopy;
}

async function buildEntry(constraint, copy) {
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

async function buildEntries(existingEntries, constraints, copy) {
  return Promise.all(
    constraints.map(async (constraint) => {
      const existingEntryForConstraint = findExistingEntryForConstraint(
        existingEntries,
        constraint
      );

      if (existingEntryForConstraint) {
        return existingEntryForConstraint;
      } else {
        const randomCopy = await getRandomCopyForConstraint(copy, constraint);
        return await buildEntry(constraint, randomCopy);
      }
    })
  );
}

async function getLog(dow, hour, length = DEFAULT_LOG_LENGTH) {
  const pairs = createDayAndHourPairs(dow, hour, length);
  const existingEntries = await getTrafficLogEntriesForMultipleHours(
    pairs,
    length
  );
  const constraints = await getMultipleConstraints(pairs);
  const spotKeys = combineSpotKeysAtConstraints(constraints);
  const copy = await getActiveCopy(spotKeys);
  const entries = await buildEntries(existingEntries, constraints, copy);
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

async function getReport(start, end) {
  const { entities: entries } = await TrafficLogEntry.list({
    filters: [
      ["log_date", ">=", start],
      ["log_date", "<=", end],
    ],
  }).populate(["spot", "spot_copy"]);

  const header = ["readtime", "dow", "slot_time", "title", "type", "excerpt"];
  const rows = entries.sort(byReadTime).map((entry) => {
    const fields = [];
    const dt = DateTime.fromJSDate(entry.readtime).setZone("America/Chicago");
    fields.push(dt.toISO());
    fields.push(dt.weekdayLong);
    fields.push(`${entry.hour}:${entry.slot.toString().padStart(2, 0)}`);
    fields.push(entry.spot.title);
    fields.push(entry.spot.type);
    const excerpt = entry.spot_copy
      ? `${entry.spot_copy.body.substring(0, 12)}...`
      : "";
    fields.push(excerpt);
    return fields;
  });

  return stringify([header, ...rows]);
}

module.exports = {
  addEntry,
  copyIsRunning,
  createDayAndHourPairs,
  getLog,
  getReport,
};
