import { defineStore } from "pinia";
import { api } from "../services/api.service";

let intervalID;
const ROTATION_PLAY_WINDOW = 4; // hours
const ROTATION_PLAY_POLLING_INTERVAL = 5 * 60 * 1000; // every five minutes
const GROUP_SLOTS_WITHIN = 3; // minutes

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
      return state.trafficLogGroups.find((group) => group.includes(entry));
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
      this.events = [...this.events, ...events];
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
    async getTrafficLog() {
      this.loadingTrafficLog = true;
      const { data: slots } = await api.get("/traffic-log"); 
      
      slots.forEach((slot) => {
        if(!slot.entry.spot_copy) {          
          slot.entry.spot_copy = slot.copy[Math.floor(Math.random() * slot.copy.length)];
          slot.entry.spot = slot.entry.spot_copy.spot;
        }
      });

      let grouping = false;
      let groups = [];
      slots.forEach((slot, i) => {
        const entry = slot.entry;
        
        if (grouping) {
          groups.at(-1).push(entry);
        }
        if (i === slots.length - 1) {
          return;
        }

        const nextEntry = slots[i + 1].entry;
        if (entry.spot && nextEntry?.spot) {
          const slotTime = entry.hour * 60 + entry.slot;
          const nextSlotTime = nextEntry.hour * 60 + nextEntry.slot;

          if (nextSlotTime - slotTime <= GROUP_SLOTS_WITHIN) {
            if (!grouping) {
              groups.push([entry]);
              grouping = true;
            }
          } else {
            grouping = false;
          }
        }
      });

      this.trafficLog = slots;
      this.trafficLogGroups = groups;
      this.loadingTrafficLog = false;
    },
    async addTrafficLogEntry(body) {
      const { data } = await api.post("/traffic-log", body);
      const slot = this.trafficLog.find((element) => {
        return (
          element.entry.dow === data.dow &&
          element.entry.hour === data.hour &&
          element.entry.slot === data.slot
        );
      });
      Object.assign(slot.entry, data);
    },
  },
});
