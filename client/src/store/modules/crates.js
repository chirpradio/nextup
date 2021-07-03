import api from "../../services/api.service";

const state = () => ({
  crates: [],
  loadingCrates: false,
});

const getters = {
  crates: (state) => {
    return state.crates;
  },
  crate: (state) => (id) => {
    return state.crates.find((crate) => crate.id === id);
  },
  loadingCrates: (state) => {
    return state.loadingCrates;
  },
  moreCrateItems: (state) => (id) => {
    const crate = state.crates.find((crate) => crate.id === id);
    return crate.totalItems > crate.items.length;
  },
};

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

const actions = {
  async getCrates({ commit }) {
    commit("loadingCrates", true);
    const response = await api.getCrates();
    commit("crates", response);
    commit("loadingCrates", false);
  },
  async getCrate({ commit }, { crateId }) {
    commit("loadingCrates", true);
    const response = await api.getCrate(crateId);
    commit("crate", response);
    commit("loadingCrates", false);
  },
  async getCrateItems({ commit, state, dispatch }, { crateId, more }) {
    let crate = findCrate(state.crates, crateId);
    if (!crate) {
      await dispatch("getCrates");
      crate = findCrate(state.crates, crateId);
      if (!crate) {
        await dispatch("getCrate", { crateId });
        crate = findCrate(state.crates, crateId);
      }
    }
    if (more || crate.items.length === 0) {
      const response = await api.getCrateItems(crateId, {
        offset: crate.items.length,
      });
      commit("crateItems", { crateId, response });
    }
  },
  async addToCrate({ commit }, { crateId, params }) {
    await api.addToCrate(crateId, params);
    commit("addItem", { crateId, params });
  },
  async removeItem({ commit }, { crateId, index }) {
    commit("removeItem", { crateId, index });
    await api.removeFromCrate(crateId, index);
  },
  async reorderItem(_, { crateId, index, newIndex }) {
    await api.reorderItemInCrate(crateId, index, newIndex);
  },
  async addCrate({ commit }, { name }) {
    const response = await api.addCrate(name);
    commit("addCrate", response);
    return response.data;
  },
  async renameCrate({ commit }, { crateId, name }) {
    await api.renameCrate(crateId, name);
    commit("renameCrate", { crateId });
  },
  async deleteCrate({ commit }, { crateId }) {
    commit("deleteCrate", { crateId });
    await api.deleteCrate(crateId);
  },
};

const mutations = {
  crates(state, payload) {
    state.crates = payload;
    for (const crate of state.crates) {
      // Start with an empty items array so the Crate component
      // loads the actual items and not just the keys
      crate.items = [];
    }
    sortCrates(state.crates);
  },
  crate(state, payload) {
    payload.items = [];
    payload.order = payload.order || [];
    state.crates.push(payload);
  },
  crateItems(state, payload) {
    const crate = state.crates.find((crate) => crate.id === payload.crateId);
    crate.items = [...crate.items, ...payload.response];
  },
  loadingCrates(state, payload) {
    state.loadingCrates = payload;
  },
  removeItem(state, payload) {
    const crate = findCrate(state.crates, payload.crateId);
    crate.items.splice(payload.index, 1);
    crate.totalItems--;
  },
  addItem(state, payload) {
    const crate = findCrate(state.crates, payload.crateId);
    if (crate) {
      if (crate.items) {
        const item = payload.params.item;
        const index = payload.params.index;
        if (item) {
          const normalizedItem = {
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
            kind: "CrateItem",
          };
          if (Number.isInteger(index)) {
            crate.items.splice(index, 0, normalizedItem);
          } else {
            crate.items.push(normalizedItem);
          }
        } else if (payload.params.path) {
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
  },
  addCrate(state, payload) {
    state.crates.push(payload.data);
    sortCrates(state.crates);
  },
  renameCrate(state, payload) {
    const crate = findCrate(state.crates, payload.crateId);
    crate.name = payload.name;
  },
  deleteCrate(state, payload) {
    const index = state.crates.findIndex(
      (element) => element.id === payload.crateId
    );
    state.crates.splice(index, 1);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
