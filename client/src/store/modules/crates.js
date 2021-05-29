import api from '../../services/api.service';

const state = () => ({
  crates: [],
});

const getters = {
  crates: state => {
    return state.crates;
  },
}

const actions = {
  async getCrates ({ commit }) {
    const response = await api.getCrates();
    commit("crates", response);
  },
  async addToCrate ({ commit, state }, { crateId, path }) {
    try {
      await api.addToCrate(crateId, path);
    } catch (error) {
      throw error;
    }
  },
}

const mutations = {
  crates (state, payload) {    
    state.crates = payload;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}