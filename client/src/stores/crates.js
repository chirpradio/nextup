import { defineStore } from 'pinia';
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

function normalizeCrateItem(item) {
  return {
    track: {
      title: item.track,
    },
    artist: {
      name: item.artist,
    },
    album: {
      title: item.album,
      label: item.label,
    },
    notes: item.notes,
    categories: item.categories,
    kind: "CrateItem",
  };
}

function addItem(crates, crateId, { item, index, path }) {
    const crate = findCrate(crates, crateId);
    if (crate) {
      if (crate.items) {        
        if (item) {
          const normalizedItem = normalizeCrateItem(item);
          
          if (Number.isInteger(index)) {
            crate.items.splice(index, 0, normalizedItem);
          } else {
            crate.items.push(normalizedItem);
          }
        } else if (path) {
          /*
            Using the "add to crate" dropdown should force a reload
            of items if user visits the crate's page so we don't 
            have to duplicate full addition and order logic in client
          */
          crate.items = [];
        }
        
        crate.totalItems++;
      }
    }
  }

export const useCratesStore = defineStore('crates', {
  state: () => ({
    crates: [],
    loadingCrates: false,
    lastAddedTo: null,
  }),
  getters: {
    crate: (state) => (id) => { 
      return findCrate(state.crates, id);
    },
  },
  actions: {
    async getCrates() {
      this.loadingCrates = true;
      const response = await api.getCrates();      
      this.crates = response;
      for (const crate of this.crates) {
        // Start with an empty items array so the Crate component
        // loads the actual items and not just the keys
        crate.items = [];
      }
      sortCrates(this.crates);
      this.loadingCrates = false;
    },
    async getCrate({ crateId }) {
      this.loadingCrates = true;
      const crate = await api.getCrate(crateId);      
      crate.items = [];
      crate.order = crate.order || [];
      this.crates.push(crate);
      this.loadingCrates = false;
    },
    async getCrateItems({ crateId }) {
      let crate = findCrate(this.crates, crateId);
      if (!crate) {
        await this.getCrates();
        crate = findCrate(this.crates, crateId);
        if (!crate) {
          await this.getCrate({ crateId });
          crate = findCrate(this.crates, crateId);
        }
      }
      if (crate.items.length === 0) {
        const response = await api.getCrateItems(crateId);
        const crate = this.crates.find((crate) => crate.id === crateId);
        crate.items = [...crate.items, ...response];
      }
    },
    async addToCrate({ crateId, params }) {
      await api.addToCrate(crateId, params);
      addItem(this.crates, crateId, params);
      this.lastAddedTo = findCrate(this.crates, crateId);
    },
    async removeItem({ crateId, index }) {      
      const crate = findCrate(this.crates, crateId);
      crate.items.splice(index, 1);
      crate.totalItems--;
      await api.removeFromCrate(crateId, index);
    },
    async reorderItem({ crateId, index, newIndex }) {
      await api.reorderItemInCrate(crateId, index, newIndex);
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
      const index = this.crates.findIndex(
        (element) => element.id === crateId
      );
      this.crates.splice(index, 1);
      await api.deleteCrate(crateId);
    },
  },
  persist: {
    paths: ["lastAddedTo"],
  },
});
