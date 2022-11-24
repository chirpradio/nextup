import { defineStore } from "pinia";
import api from "../services/api.service";

export const useSpotsStore = defineStore("spots", {
  state: () => ({
    spots: [],
    loadingSpots: false,
    trafficLog: [],
    loadingTrafficLog: false,
    addingToLog: false,
  }),
  getters: {
    spot: (state) => (id) => {
      return state.spots.find((element) => element.id === id);
    },
  },
  actions: {
    async getSpots() {
      this.loadingSpots = true;
      const response = await api.getSpots();
      this.spots = response;
      this.loadingSpots = false;
    },
    async getSpot({ spotId }) {
      this.loadingSpots = true;
      const response = await api.getSpot(spotId);
      const index = this.spots.indexOf((element) => element.id === spotId);
      this.spots.splice(index, 0, response);
      this.loadingSpots = false;
    },
    async addSpot({ title, type }) {
      const response = await api.addSpot(title, type);
      this.spots.push(response);
    },
    async updateSpot({ spotId, data }) {
      const response = await api.updateSpot(spotId, data);
      const index = this.spots.indexOf((element) => element.id === spotId);
      this.spots.splice(index, 0, response);
    },
    async deleteSpot({ spotId }) {
      await api.deleteSpot(spotId);
      const index = this.spots.indexOf((element) => element.id === spotId);
      this.spots.splice(index, 1);
    },
    async addCopyToSpot({ spotId, body, dates }) {
      const response = await api.addCopyToSpot(spotId, body, dates);
      const spot = this.spot(spotId);
      spot.copy.push(response);
    },
    async updateCopy({ copy, data }) {
      await api.updateCopy(copy.id, data);
      Object.assign(copy, data);
    },
    async deleteCopy({ copy }) {
      await api.deleteCopy(copy.id);
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
    async addTrafficLogEntry(entry) {
      this.addingToLog = true;
      const response = await api.addTrafficLogEntry(entry);
      Object.assign(entry, response);
      this.addingToLog = false;
    },
  },
});
