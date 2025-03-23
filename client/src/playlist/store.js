import { defineStore } from "pinia";
import { api } from "../services/api.service";
import { DateTime } from "luxon";
import { _ } from "lodash";

let intervalID;
const ROTATION_PLAY_WINDOW = 4; // hours
const ROTATION_PLAY_POLLING_INTERVAL = 5 * 60 * 1000; // every five minutes
const GROUP_ENTRIES_WITHIN = 3; // minutes
const TRAFFIC_LOG_POLLING_INTERVAL = 60 * 1000; // every minute

function getChicagoWeekdayAndHour(hourOffset = 0) {
  const dt = DateTime.now()
    .setZone("America/Chicago")
    .plus({ hours: hourOffset });
  return { weekday: dt.weekday, hour: dt.hour };
}

function checkSlotsForUpdates(trafficLog) {
  const needed = [getChicagoWeekdayAndHour(), getChicagoWeekdayAndHour(1)];

  const current = _.chain(trafficLog)
    .map((entry) => {
      return {
        weekday: entry.dow,
        hour: entry.hour,
      };
    })
    .uniqWith(_.isEqual)
    .value();

  const missing = needed.filter((pair) => {
    return !trafficLog.some((entry) => {
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

async function updateTrafficLog(store) {
  const updates = checkSlotsForUpdates(store.trafficLog);

  if (updates.outdated.length > 0) {
    updates.outdated.forEach(({ weekday, hour }) => {
      store.removeEntries(weekday, hour);
    });
  }
  
  if (updates.missing.length > 0) {
    await Promise.all(updates.missing.map(store.getEntries));
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
    if (nextEntry.slot - entry.slot <= GROUP_ENTRIES_WITHIN) {
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

export const usePlaylistStore = defineStore("playlist", {
  state: () => ({
    adding: false,
    cuedTrack: undefined,
    events: [],
    lastUpdated: undefined,
    onAir: false,
    rotationPlays: {
      plays: [],
      start: undefined,
      end: undefined,
    },
    selectedAlbumId: undefined,
    trafficLog: [],
    trafficLogGroups: [],
    loadingTrafficLog: false,
  }),
  getters: {
    recentPlay: (state) => (album) => {
      const idToFind = album.id || album.__key?.name;
      return state.rotationPlays.plays.find(
        (play) => play.album?.name === idToFind
      );
    },
    group: (state) => (entry) => {
      if (!entry) return null;
      return state.trafficLogGroups.find((group) =>
        group.some(
          (groupedEntry) => entry.scheduled.name === groupedEntry.scheduled.name
        )
      );
    },
  },
  actions: {
    async addBreak() {
      this.adding = true;
      await api.post("/playlist/break");
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    async addFreeformPlaylistTrack(data) {
      this.adding = true;
      await api.post("/playlist/freeform", data);
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    async addPlaylistTrack(data) {
      this.adding = true;
      await api.post("/playlist/track", data);
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    clearCuedTrack() {
      this.cuedTrack = undefined;
    },
    cue(track) {
      this.cuedTrack = track;
    },
    async deletePlaylistEvent(event) {
      const index = this.events.findIndex((element) => element.id === event.id);
      this.events.splice(index, 1);
      await api.delete(`/playlist/${event.id}`);
    },
    async getPlaylistEvents({ start, end } = {}) {
      const options = {};
      if (start || end) {
        const params = {};
        if (start) {
          params.start = start;
        }
        if (end) {
          params.end = end;
        }
        options.params = params;
      }

      const { data: events } = await api.get("/playlist", options);
      for (const event of events) {
        const index = this.events.findIndex((item) => item.id === event.id);
        if (index > -1) {
          this.events.splice(index, 1, event);
        } else {
          this.events.push(event);
        }
      }
      this.lastUpdated = Date.now();
    },
    async getRecentRotationPlays() {
      try {
        const start = new Date();
        start.setHours(start.getHours() - ROTATION_PLAY_WINDOW);
        const { data: rotationPlays } = await api.get("/playlist/rotation", {
          params: {
            start: start.getTime(),
          },
        });
        this.rotationPlays = rotationPlays;
      } catch (error) {
        console.error(error);
        intervalID = undefined;
      }
    },
    async pollRotationPlays() {
      this.getRecentRotationPlays();
      if (!intervalID) {
        intervalID = setInterval(
          this.getRecentRotationPlays,
          ROTATION_PLAY_POLLING_INTERVAL
        );
      }
    },
    selectAlbum(id) {
      this.selectedAlbumId = id;
    },
    async getEntries({ weekday, hour } = {}) {
      this.loadingTrafficLog = true;
      const { data: entries } = await api.get("/traffic-log", {
        params: {
          dow: weekday,
          hour,
        },
      });
      this.trafficLog = [...this.trafficLog, ...entries];
      this.trafficLog.sort(sortEntries);
      this.trafficLogGroups = [
        ...this.trafficLogGroups,
        ...groupNearbyEntries(entries),
      ];
      this.loadingTrafficLog = false;
    },
    removeEntries(weekday, hour) {
      this.trafficLog = this.trafficLog.filter((entry) => entry.hour !== hour);

      this.trafficLogGroups = this.trafficLogGroups.filter(
        (group) => !group.some((entry) => entry.hour === hour)
      );
    },
    async addTrafficLogEntry(body) {
      const { data } = await api.post("/traffic-log", body);
      const entry = this.trafficLog.find((element) => {
        return (
          element.dow === data.dow &&
          element.hour === data.hour &&
          element.slot === data.slot
        );
      });
      Object.assign(entry, data);
    },
  },
  persist: {
    paths: ["trafficLog", "trafficLogGroups", "onAir"],
    afterRestore: ({ store }) => {
      updateTrafficLog(store);
      setInterval(updateTrafficLog, TRAFFIC_LOG_POLLING_INTERVAL, store);
    },
  },
});
