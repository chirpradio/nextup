import { defineStore } from 'pinia';
import api from "../services/api.service";

export const usePlaylistStore = defineStore('playlist', {
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
    async getRotationPlays({ start, end } = {}) {
      if (
        this.rotationPlays.start !== start ||
        this.rotationPlays.end !== end
      ) {
        this.rotationPlays = await api.getRotationPlays({ start, end });
      }
    },
  },
});
