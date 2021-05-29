import api from '../../services/api.service';

const state = () => ({
  artists: {},
  artistAlbums: {},
});

const getters = {
  artist: state => id => {
    return state.artists[id];
  },
  artistAlbums: state => id => {
    return state.artistAlbums[id];
  }
}

const actions = {
  async getArtist ({ commit, state }, id) {
    if(!state.artists[id]) {
      const response = await api.getArtist(id);
      commit("artists", { id, response });
    }
  },
  async getArtistAlbums ({ commit,state }, id) {
    if(!state.artistAlbums[id]) {
      const response = await api.getArtistAlbums(id);
      commit("artistAlbums", { id, albums: response.albums });
    }
  }
}

const mutations = {
  artists (state, payload) {    
    state.artists[payload.id] = payload.response;
  },
  artistAlbums (state, payload) {
    state.artistAlbums[payload.id] = payload.albums ;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}