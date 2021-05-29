import api from '../../services/api.service';

const state = () => ({
  loading: false,
  query: {},
  results: {},
});

const getters = {
  loading: state => {
    return state.loading;
  },
  query: state => {
    return state.query;
  },
  results: state => {
    return state.results;
  }, 
}

const actions = {
  async search ({ commit }, query) {    
    commit("loading", true);
    commit("query", query);
    const response = await api.search(query);
    commit("results", { results: response, type: query.type });
    commit("loading", false);
  },
  async setOffset({ commit, dispatch, state }, offset) {
    commit("offset", offset);
    await dispatch("search", state.query);
  },
}

const mutations = {
  loading (state, loading) {
    state.loading = loading;
  },
  query (state, query) {
    state.query = query;
  },
  results (state, payload) { 
    if(payload.type) {
      state.results[payload.type] = payload.results;
    } else {
      state.results = payload.results;
    }
  },
  offset (state, offset) {
    state.query.offset = offset;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}