import { defineStore } from "pinia";
import api from "../services/api.service";

export const useReportsStore = defineStore("reports", {
  state: () => ({
    rotationPlays: {
      plays: [],
      start: undefined,
      end: undefined,
    },
  }),
  actions: {
    async getRotationPlays({ start, end } = {}) {
      if (this.start !== start || this.end !== end) {
        this.rotationPlays = await api.getRotationPlays({ start, end });
      }
    },
  },
});
