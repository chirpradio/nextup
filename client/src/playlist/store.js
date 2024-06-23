import { defineStore } from "pinia";
import { api } from "../services/api.service";

let intervalID;
const ROTATION_PLAY_WINDOW = 4; // hours
const ROTATION_PLAY_POLLING_INTERVAL = 5 * 60 * 1000; // every five minutes

export const usePlaylistStore = defineStore("playlist", {
  state: () => ({
    adding: false,
    events: [],
    lastUpdated: undefined,
    onAir: false,
    rotationPlays: {
      plays: [],
      start: undefined,
      end: undefined,
    },
  }),
  getters: {
    recentPlay: (state) => (album) => {
      const idToFind = album.id || album.__key?.name;
      return state.rotationPlays.plays.find(
        (play) => play.album?.name === idToFind
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
      const start = new Date();
      start.setHours(start.getHours() - ROTATION_PLAY_WINDOW);
      const { data: rotationPlays } = await api.get("/playlist/rotation", {
        params: {
          start: start.getTime(),
        },
      });
      this.rotationPlays = rotationPlays;
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
  },
});
