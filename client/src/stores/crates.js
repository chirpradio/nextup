import { defineStore } from "pinia";
import api from "../services/api.service";

function findCrate(crates, crateId) {
  return crates.find((crate) => crate.id === crateId);
}

function sortCrates(crates) {
  crates.sort((a, b) => {
    if (a.name === b.name || !a.name || !b.name) {
      return 0;
    }
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
  });
}

export const useCratesStore = defineStore("crates", {
  state: () => ({
    crates: [],
    items: {},
    loadingCrates: false,
    lastAddedTo: null,
  }),
  getters: {
    crate: (state) => (id) => {
      return findCrate(state.crates, id);
    },
    crateItems: (state) => (id) => {
      return state.items[id];
    },
  },
  actions: {
    async getCrates() {
      this.loadingCrates = true;
      const response = await api.getCrates();
      this.crates = response;
      sortCrates(this.crates);
      this.loadingCrates = false;
    },
    async getCrate({ crateId }) {
      this.loadingCrates = true;
      const crate = await api.getCrate(crateId);
      this.items[crateId] = [];
      crate.order = crate.order || [];
      this.crates.push(crate);
      this.loadingCrates = false;
    },
    async addCrate({ name }) {
      const response = await api.addCrate(name);
      this.crates.push(response.data);
      sortCrates(this.crates);
      return response.data;
    },
    async renameCrate({ crateId, name }) {
      await api.renameCrate(crateId, name);
      const crate = findCrate(this.crates, crateId);
      crate.name = name;
    },
    async deleteCrate({ crateId }) {
      const index = this.crates.findIndex((element) => element.id === crateId);
      this.crates.splice(index, 1);
      await api.deleteCrate(crateId);
    },
    async getCrateItems({ crateId }) {
      const items = await api.getCrateItems(crateId);
      this.items[crateId] = items;
    },
    async addToCrate({ crateId, params }) {
      const items = await api.addToCrate(crateId, params);
      this.items[crateId] = items;

      const crate = findCrate(this.crates, crateId);
      crate.totalItems++;
      this.lastAddedTo = crate;
    },
    async removeItem({ crateId, index }) {
      const crate = findCrate(this.crates, crateId);
      this.items[crateId].splice(index, 1);
      crate.totalItems--;
      await api.removeFromCrate(crateId, index);
    },
    async reorderItem({ crateId, index, newIndex }) {
      await api.reorderItemInCrate(crateId, index, newIndex);
    },
  },
  persist: {
    paths: ["lastAddedTo"],
  },
});
