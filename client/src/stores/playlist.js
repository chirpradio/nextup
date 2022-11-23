import { defineStore } from "pinia";
import api from "../services/api.service";

let intervalID;

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
      await api.addBreak();
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    async addFreeformPlaylistTrack(data) {
      this.adding = true;
      await api.addFreeformPlaylistTrack(data);
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    async addPlaylistTrack(data) {
      this.adding = true;
      await api.addPlaylistTrack(data);
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    async getPlaylistEvents({ start, end } = {}) {
      const response = await api.getPlaylistEvents({ start, end });
      this.events = [...this.events, ...response.data];
      this.lastUpdated = Date.now();
    },
    async getRecentRotationPlays() {
      const start = new Date();
      start.setHours(start.getHours() - 6);
      this.rotationPlays = await api.getRotationPlays({ start: start.getTime() });
    },
    async pollRotationPlays() {
      this.getRecentRotationPlays();
      if (!intervalID) {
        intervalID = setInterval(this.getRecentRotationPlays, 5 * 60 * 1000); // every five minutes
      }
    },
  },
});
