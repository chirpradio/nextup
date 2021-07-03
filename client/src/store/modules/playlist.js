import api from "../../services/api.service";

const state = () => ({
  rotationPlays: {
    plays: [],
    start: undefined,
    end: undefined,
  },
});

const getters = {
  rotationPlays: (state) => {
    return state.rotationPlays.plays;
  },
};

const actions = {
  async getRotationPlays({ commit, state }, { start, end } = {}) {
    if (
      state.rotationPlays.start !== start ||
      state.rotationPlays.end !== end
    ) {
      const response = await api.getRotationPlays({ start, end });
      commit("rotationPlays", { response });
    }
  },
};

const mutations = {
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
