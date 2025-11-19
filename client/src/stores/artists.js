import { defineStore } from "pinia";
import api from "../services/api.service";

export const useArtistsStore = defineStore("artists", {
  state: () => ({
    _artists: {},
    _artistAlbums: {},
    _artistAppearsOn: {},
  }),
  getters: {
    artist: (state) => (id) => {
      return state._artists[id];
    },
    artistAlbums: (state) => (id) => {
      return state._artistAlbums[id];
    },
    artistAppearsOn: (state) => (id) => {
      return state._artistAppearsOn[id];
    },
  },
  actions: {
    async getArtist(id) {
      if (!this._artists[id]) {
        const response = await api.getArtist(id);
        this._artists[id] = response;
      }
    },
    async getArtistAlbums(id) {
      if (!this._artistAlbums[id]) {
        const response = await api.getArtistAlbums(id);
        this._artistAlbums[id] = response.albums;
        this._artistAppearsOn[id] = response.appearsOn;
      }
    },
  },
});
