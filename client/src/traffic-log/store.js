import { defineStore } from "pinia";
import { api } from "../services/api.service";

const GROUP_SLOTS_WITHIN = 3; // minutes

function sortSpotsByTitle(a, b) {
  if (a.title === b.title || !a.title || !b.title) {
    return 0;
  }
  return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
}

function sortCopyByLastUpdated(a, b) {
  return a.updated < b.updated ? 1 : -1;
}

export const useSpotsStore = defineStore("spots", {
  state: () => ({
    spots: [],
    loadingSpots: false,
    loadedSpots: false,
    savingSpot: false,
    trafficLog: [],
    trafficLogGroups: [],
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
    group: (state) => (entry) => {
      return state.trafficLogGroups.find((group) => group.includes(entry));
    },
  },
  actions: {
    async getSpots() {
      this.loadingSpots = true;
      const { data: spots } = await api.get("/spot");
      this.spots = spots.sort(sortSpotsByTitle);
      this.spots.forEach((spot) => spot.copy.sort(sortCopyByLastUpdated));
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
    async deleteSpot(spotId) {
      await api.delete(`/spot/${spotId}`);
      const index = this.spots.findIndex((element) => element.id === spotId);
      this.spots.splice(index, 1);
    },
    async addCopyToSpot({ spotId, copy }) {
      const { data } = await api.post(`/spot/${spotId}/copy`, copy);
      const spot = this.spot(spotId);
      spot.copy.unshift(data);
    },
    async updateCopy({ copy, body }) {
      const { data } = await api.patch(`/spot/copy/${copy.id}`, body);
      const spot = this.spot(data.spot.id);

      // if they changed the spot
      if (copy.spot.id !== data.spot.id) {
        // remove from old spot
        const oldSpot = this.spot(copy.spot.id);
        const index = oldSpot.copy.findIndex(
          (element) => element.id === copy.id
        );
        oldSpot.copy.splice(index, 1);

        // add to the new one
        spot.copy.push(copy);
      }

      Object.assign(copy, data);
      spot.copy.sort(sortCopyByLastUpdated);
    },
    async deleteCopy(copy) {
      await api.delete(`/spot/copy/${copy.id}`);
      const spot = this.spot(copy.spot.id);
      const index = spot.copy.findIndex((element) => element.id === copy.id);
      spot.copy.splice(index, 1);
    },
    async getTrafficLog() {
      this.loadingTrafficLog = true;
      const { data } = await api.get("/traffic-log");
      const withSpots = data.filter((entry) => entry.spot);

      let grouping = false;
      let groups = [];
      for (let i = 0; i < withSpots.length; i++) {
        const copy = withSpots[i];
        const nextCopy = withSpots[i + 1];

        if (grouping) {
          groups.at(-1).push(copy);
        }

        if (copy.spot && nextCopy?.spot) {
          const copyTime = copy.hour * 60 + copy.slot;
          const nextCopyTime = nextCopy.hour * 60 + nextCopy.slot;

          if (nextCopyTime - copyTime <= GROUP_SLOTS_WITHIN) {
            if (!grouping) {
              groups.push([copy]);
              grouping = true;
            }
          } else {
            grouping = false;
          }
        }
      }

      this.trafficLog = withSpots;
      this.trafficLogGroups = groups;
      this.loadingTrafficLog = false;
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
});
