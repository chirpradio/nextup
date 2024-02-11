import { defineStore } from "pinia";
import { api } from "../services/api.service";

function sortSpotsByTitle(a, b) {
  if (a.title === b.title || !a.title || !b.title) {
    return 0;
  }
  return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
}

export const useSpotsStore = defineStore("spots", {
  state: () => ({
    spots: [],
    loadingSpots: false,
    loadedSpots: false,
    savingSpot: false,
    trafficLog: [],
    loadingTrafficLog: false,
  }),
  getters: {
    spot: (state) => (id) => {
      return state.spots.find((element) => element.id == id);
    },
    copy: (state) => (spotId, copyId) => {
      const spot = state.spots.find((element) => element.id === spotId);
      if (spot) {
        return spot.copy.find((element) => element.id === copyId);
      }
    },
  },
  actions: {
    async getSpots() {
      this.loadingSpots = true;
      const { data } = await api.get("/spot");
      this.spots = data.sort(sortSpotsByTitle);
      this.loadingSpots = false;
      this.loadedSpots = true;
    },
    async getSpot(spotId) {
      this.loadingSpots = true;
      const { data } = await api.get(`/spot/${spotId}`);
      const index = this.spots.findIndex((spot) => spot.id === spotId);
      if (index === -1) {
        this.spots.push(data);
      } else {
        this.spots.splice(index, 1, data);
      }
      this.loadingSpots = false;
    },
    async addSpot({ title, type, slot, selected }) {
      this.savingSpot = true;
      const constraints = selected.map((c) => `${c.day}:${c.hour}:${slot}`);
      const { data } = await api.post("/spot", {
        title,
        type,
        constraints,
      });
      this.spots.push(data);
      this.spots.sort(sortSpotsByTitle);
      this.savingSpot = false;
    },
    async updateSpot(spotId, { title, type, slot, selected }) {
      this.savingSpot = true;
      const constraints = selected.map((c) => `${c.day}:${c.hour}:${slot}`);
      const { data } = await api.patch(`/spot/${spotId}`, {
        title,
        type,
        constraints,
      });
      const index = this.spots.findIndex((spot) => spot.id === spotId);
      this.spots.splice(index, 1, data);
      this.spots.sort(sortSpotsByTitle);
      this.savingSpot = false;
    },
    async deleteSpot({ spotId }) {
      await api.deleteSpot(spotId);
      const index = this.spots.indexOf((element) => element.id === spotId);
      this.spots.splice(index, 1);
    },
    async addCopyToSpot({ spotId, copy }) {
      const { data } = await api.post(`/spot/${spotId}/copy`, copy);
      const spot = this.spot(spotId);
      spot.copy.push(data);
    },
    async updateCopy({ copy, body }) {
      const { data } = await api.patch(`/spot/copy/${copy.id}`, body);
      Object.assign(copy, data);
    },
    async deleteCopy(copy) {
      await api.delete(`/spot/copy/${copy.id}`);
      const spot = this.spot(copy.spot.id);
      const index = spot.copy.findIndex((element) => element.id === copy.id);
      spot.copy.splice(index, 1);
    },
    async getTrafficLog() {
      this.loadingTrafficLog = true;
      const response = await api.getTrafficLog();
      this.trafficLog = response;
      this.loadingTrafficLog = false;
    },
    async addTrafficLogEntry(data) {
      const response = await api.addTrafficLogEntry(data);
      const entry = this.trafficLog.find((element) => {
        return (
          element.dow === response.dow &&
          element.hour === response.hour &&
          element.slot === response.slot
        );
      });
      Object.assign(entry, response);
    },
  },
});
