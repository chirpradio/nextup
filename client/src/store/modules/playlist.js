import api from "../../services/api.service";

const state = () => ({
  onAir: false,
  rotationPlays: {
    plays: [],
    start: undefined,
    end: undefined,
  },
});

const getters = {
  onAir: (state) => {
    return state.onAir;
  },
  rotationPlays: (state) => {
    return state.rotationPlays.plays;
  },
};

const actions = {
  async addFreeformPlaylistTrack(_, data) {
    await api.addFreeformPlaylistTrack(data);
  },
  async addPlaylistTrack(_, data) {
    await api.addPlaylistTrack(data);
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
