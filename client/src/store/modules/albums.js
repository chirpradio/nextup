import api from "../../services/api.service";

const state = () => ({
  tagCollections: {
    heavy_rotation: {
      albums: [],
      more: false,
    },
    light_rotation: {
      albums: [],
      more: false,
    },
  },
  loadingTagCollections: {
    heavy_rotation: false,
    light_rotation: false,
    recent: false,
  },
  recent: {
    albums: [],
    more: false,
  },
  albums: {},
});

const getters = {
  recentAlbums: (state) => {
    return state.recent.albums;
  },
  moreRecentAlbums: (state) => {
    return state.recent.more;
  },
  loadingRecentAlbums: (state) => {
    return state.loadingTagCollections.recent;
  },
  libraryAdds: (state) => {
    return state.recent.albums.filter((album) => {
      if (!album.current_tags) {
        return true;
      }
      return (
        !album.current_tags.includes("heavy_rotation") &&
        !album.current_tags.includes("light_rotation")
      );
    });
  },
  taggedAlbums: (state) => (tag) => {
    return state.tagCollections[tag].albums;
  },
  loadingTaggedAlbums: (state) => (tag) => {
    return state.loadingTagCollections[tag];
  },
  moreAlbumsWithTag: (state) => (tag) => {
    return state.tagCollections[tag].more;
  },
  albumById: (state) => (id) => {
    return state.albums[id];
  },
};

const actions = {
  async getRecentAlbums({ commit, state }) {
    if (state.recent.albums.length === 0) {
      commit("loadingRecent", true);
      const response = await api.getRecentAlbums();
      commit("recent", response);
      commit("loadingRecent", false);
    }
  },
  async getMoreRecentAlbums({ commit, state }) {
    commit("loadingRecent", true);
    const response = await api.getRecentAlbums({
      offset: state.recent.albums.length,
    });
    commit("recent", response);
    commit("loadingRecent", false);
  },
  async getTaggedAlbums({ commit, state }, tag) {
    if (state.tagCollections[tag].albums.length === 0) {
      commit("loadingTagCollections", {
        tag,
        loading: true,
      });
      const response = await api.getTaggedAlbums({
        tag,
        offset: 0,
      });
      commit("tagCollections", {
        tag,
        ...response,
      });
      commit("loadingTagCollections", {
        tag,
        loading: false,
      });
    }
  },
  async getMoreTaggedAlbums({ commit, state }, tag) {
    commit("loadingTagCollections", {
      tag,
      loading: true,
    });
    const response = await api.getTaggedAlbums({
      tag,
      offset: state.tagCollections[tag].albums.length,
    });
    commit("tagCollections", {
      tag,
      ...response,
    });
    commit("loadingTagCollections", {
      tag,
      loading: false,
    });
  },
  async getAlbum({ commit, state }, id) {
    if (!state.albums[id]) {
      const response = await api.getAlbum(id);
      commit("albums", response);
    }
  },
};

const mutations = {
  recent(state, collection) {
    const more = typeof collection.nextPageCursor === "string";
    const albums = state.recent.albums.concat(collection.albums);
    state.recent = {
      albums,
      more,
    };
  },
  loadingRecent(state, payload) {
    state.loadingTagCollections.recent = payload;
  },
  tagCollections(state, collection) {
    const more = typeof collection.nextPageCursor === "string";
    const albums = state.tagCollections[collection.tag].albums.concat(
      collection.albums
    );
    state.tagCollections[collection.tag] = {
      albums,
      more,
    };
  },
  loadingTagCollections(state, payload) {
    state.loadingTagCollections[payload.tag] = payload.loading;
  },
  albums(state, album) {
    state.albums[album.album_id.value] = album;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
