import api from "../../services/api.service";

function findSpot (state, id) {
  return state.spots.find((element) => element.id === id);
}

const state = () => ({
  spots: [],
  loadingSpots: false,
  trafficLog: [],
  loadingTrafficLog: false,
});

const getters = {
  spots: (state) => {
    return state.spots;
  },
  loadingSpots: (state) => {
    return state.loadingSpots;
  },
  spot: (state) => (id) => {
    return state.spots.find((element) => element.id === id);
  },
  trafficLog: (state) => {
    return state.trafficLog;
  },
};

const actions = {
  async getSpots({ commit }) {
    commit("loadingSpots", true);
    const response = await api.getSpots();
    commit("spots", { response });
    commit("loadingSpots", false);
  },
  async getSpot({ commit }, { spotId }) {
    commit("loadingSpots", true);
    const response = await api.getSpot(spotId);
    commit("spot", { spotId, response });
    commit("loadingSpots", false);
  },
  async addSpot({ commit }, { title, type }) {
    const response = await api.addSpot(title, type);
    commit("addSpot", { response });
  },
  async updateSpot({ commit }, { spotId, data }) {
    const response = await api.updateSpot(spotId, data);
    commit("spot", { spotId, response });
  },
  async deleteSpot({ commit }, spotId) {
    await api.deleteSpot(spotId);
    commit("deleteSpot", { spotId });
  },
  async addCopyToSpot({ commit }, { spotId, body, dates }) {
    const response = await api.addCopyToSpot(spotId, body, dates);
    commit("addCopyToSpot", { spotId, response });
  },
  async updateCopy({ commit }, { copy, data }) {
    await api.updateCopy(copy.id, data);
    commit("updateCopy", { copy, data });
  },
  async deleteCopy({ commit }, { copy }) {
    await api.deleteCopy(copy.id);
    commit("deleteCopy", { copy });
  },
  async getTrafficLog({ commit }) {
    commit("loadingTrafficLog", true);
    const response = await api.getTrafficLog();
    commit("trafficLog", { response });
    commit("loadingTrafficLog", false);
  },
  async addTrafficLogEntry({ commit }, data) {
    const response = await api.addTrafficLogEntry(data);
    commit("addTrafficLogEntry", { response });
  },
};

const mutations = {
  loadingSpots(state, payload) {
    state.loadingSpots = payload;
  },
  spots(state, payload) {
    state.spots = payload.response;
  },
  spot(state, payload) {
    const index = state.spots.indexOf(
      (element) => element.id === payload.spotId
    );
    state.spots.splice(index, 0, payload.response);
  },
  addSpot(state, payload) {
    state.spots.push(payload.response);
  },
  deleteSpot(state, payload) {
    const index = state.spots.indexOf(
      (element) => element.id === payload.spotId
    );
    state.spots.splice(index, 1);
  },
  addCopyToSpot(state, payload) {
    const spot = state.spots.find((element) => element.id === payload.spotId);
    spot.copy.push(payload.response);
  },
  updateCopy(state, payload) {
    const spot = findSpot(state, payload.copy.spot.id);
    const copy = spot.copy.find((element) => element.id === payload.copy.id);
    Object.assign(copy, payload.data);
  },
  deleteCopy(state, payload) {
    const spot = findSpot(state, payload.copy.spot.id);
    const index = spot.copy.findIndex(
      (element) => element.id === payload.copy.id
    );
    spot.copy.splice(index, 1);
  },
  loadingTrafficLog(state, payload) {
    state.loadingTrafficLog = payload;
  },
  trafficLog(state, payload) {
    state.trafficLog = payload.response;
  },
  addTrafficLogEntry(state, payload) {
    const entry = state.trafficLog.find((element) => {
      return element.dow === payload.dow &&
        element.hour === payload.hour &&
        element.slot === payload.slot;
    });
    Object.assign(entry, payload.response);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
