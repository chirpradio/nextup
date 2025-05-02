import { defineStore } from "pinia";
import { api } from "../services/api.service";
import { DateTime } from "luxon";
import { _ } from "lodash";

let intervalID;
const GROUP_ENTRIES_WITHIN = 3; // minutes
const TRAFFIC_LOG_POLLING_INTERVAL = 60 * 1000; // every minute

function getChicagoWeekdayAndHour(hourOffset = 0) {
  const dt = DateTime.now()
    .setZone("America/Chicago")
    .plus({ hours: hourOffset });
  return { weekday: dt.weekday, hour: dt.hour };
}

function checkSlotsForUpdates(entries) {
  const needed = [getChicagoWeekdayAndHour(), getChicagoWeekdayAndHour(1)];

  const current = _.chain(entries)
    .map((entry) => {
      return {
        weekday: entry.dow,
        hour: entry.hour,
      };
    })
    .uniqWith(_.isEqual)
    .value();

  const missing = needed.filter((pair) => {
    return !entries.some((entry) => {
      return entry.dow === pair.weekday && entry.hour === pair.hour;
    });
  });

  const outdated = current.filter((currentPair) => {
    return !needed.some((neededPair) => {
      return (
        currentPair.weekday === neededPair.weekday &&
        currentPair.hour === neededPair.hour
      );
    });
  });

  return {
    missing,
    outdated,
  };
}

async function update(store) {
  const updates = checkSlotsForUpdates(store.entries);

  if (updates.outdated.length > 0) {
    await Promise.all(updates.outdated.map(store.removeEntries));
  }

  if (updates.missing.length > 0 && !store.loading) {
    /* 
      Get the multiple missing hours sequentially so each subsequent hour 
      can greylist the copy from the previous hour after it returns.
    */
    updates.missing.reduce((lastPromise, pair) => {
      return lastPromise.then(() => store.getEntries(pair));
    }, Promise.resolve());
  }
}

function groupNearbyEntries(entries) {
  let grouping = false;
  let groups = [];

  entries.forEach((entry, i) => {
    if (grouping) {
      groups.at(-1).push(entry);
    }
    if (i === entries.length - 1) {
      return;
    }

    const nextEntry = entries[i + 1];
    const sameHour = entry.hour === nextEntry.hour;
    const nearbySlots = nextEntry.slot - entry.slot <= GROUP_ENTRIES_WITHIN;
    if (sameHour && nearbySlots) {
      if (!grouping) {
        groups.push([entry]);
        grouping = true;
      }
    } else {
      grouping = false;
    }
  });

  return groups;
}

function sortEntries(a, b) {
  if (a.hour === b.hour) {
    return a.slot - b.slot;
  } else if (a.hour === 0 && b.hour === 23) {
    return 1;
  } else if (a.hour === 23 && b.hour === 0) {
    return -1;
  } else {
    return a.hour - b.hour;
  }
}

export const useTrafficLogStore = defineStore("trafficLog", {
  state: () => ({
    entries: [],
    groups: [],
    loading: false,
  }),
  getters: {
    group: (state) => (entry) => {
      if (!entry) return null;
      return state.groups.find((group) =>
        group.some(
          (groupedEntry) => entry.scheduled.name === groupedEntry.scheduled.name
        )
      );
    },
    spotCopyIdsInLastHour: (state) => {
      const lastEntry = state.entries.at(-1);
      return state.entries
        .filter((entry) => entry.hour === lastEntry.hour)
        .map((entry) => entry.spot_copy.id);
    },
  },
  actions: {
    async getEntries({ weekday, hour } = {}) {
      try {
        this.loading = true;
        const { data: newEntries } = await api.get("/traffic-log", {
          params: {
            dow: weekday,
            hour,
            greylist: this.spotCopyIdsInLastHour,
          },
        });
        this.entries = [...this.entries, ...newEntries];
        this.entries.sort(sortEntries);
        this.groups = groupNearbyEntries(this.entries);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        clearInterval(intervalID);
        intervalID = undefined;
      }
    },
    removeEntries({ hour } = {}) {
      this.entries = this.entries.filter((entry) => entry.hour !== hour);

      this.groups = this.groups.filter(
        (group) => !group.some((entry) => entry.hour === hour)
      );
    },
    async addEntry(body) {
      const { data } = await api.post("/traffic-log", body);
      const entry = this.entries.find((entry) => {
        return (
          entry.scheduled.name === data.scheduled.name &&
          entry.spot.id == data.spot.id
        );
      });
      Object.assign(entry, data);
      this.groups = groupNearbyEntries(this.entries);
    },
    pollForEntries() {
      update(this);
      if (!intervalID) {
        intervalID = setInterval(update, TRAFFIC_LOG_POLLING_INTERVAL, this);
      }
    },
  },
  persist: {
    paths: ["entries", "groups"],
  },
});
