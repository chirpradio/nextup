import { defineStore } from "pinia";
import { api } from "../services/api.service";

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
      if (
        this.rotationPlays.start !== start ||
        this.rotationPlays.end !== end
      ) {
        const { data: rotationPlays } = await api.get("/playlist/rotation", {
          start,
          end,
        });
        this.rotationPlays = rotationPlays;
      }
    },
  },
});
