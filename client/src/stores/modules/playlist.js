import api from "../../services/api.service";

const state = () => ({
  adding: false,
  events: [],
  lastUpdated: undefined,
  onAir: false,
  rotationPlays: {
    plays: [],
    start: undefined,
    end: undefined,
  },
});

const getters = {
  adding: (state) => {
    return state.adding;
  },
  events: (state) => {
    return state.events;
  },
  lastUpdated: (state) => {
    return state.lastUpdated;
  },
  onAir: (state) => {
    return state.onAir;
  },
  rotationPlays: (state) => {
    return state.rotationPlays.plays;
  },
};

const actions = {
  async addBreak({ commit, dispatch, state }) {
    commit("adding", true);
    await api.addBreak();
    commit("adding", false);
    dispatch("getPlaylistEvents", { start: state.lastUpdated });
  },
  async addFreeformPlaylistTrack({ commit, dispatch, state }, data) {
    commit("adding", true);
    await api.addFreeformPlaylistTrack(data);
    commit("adding", false);
    dispatch("getPlaylistEvents", { start: state.lastUpdated });
  },
  async addPlaylistTrack({ commit, dispatch, state }, data) {
    commit("adding", true);
    await api.addPlaylistTrack(data);
    commit("adding", false);
    dispatch("getPlaylistEvents", { start: state.lastUpdated });
  },
  async getPlaylistEvents({ commit }, { start, end } = {}) {
    const response = await api.getPlaylistEvents({ start, end });
    commit("events", response.data);
    commit("lastUpdated");
  },
  async getRotationPlays({ commit, state }, { start, end } = {}) {
    if (
      state.rotationPlays.start !== start ||
      state.rotationPlays.end !== end
    ) {
      const response = await api.getRotationPlays({ start, end });
      commit("rotationPlays", { response });
    }
  },
  async setOnAir({ commit }, value) {
    commit("onAir", value);
  },
};

const mutations = {
  adding(state, payload) {
    state.adding = payload;
  },
  addEvent(state, payload) {
    state.events.push(payload);
  },
  events(state, payload) {
    state.events = [...state.events, ...payload];
  },
  lastUpdated(state) {
    state.lastUpdated = Date.now();
  },
  onAir(state, payload) {
    state.onAir = payload;
  },
  rotationPlays(state, payload) {
    state.rotationPlays = payload.response;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
