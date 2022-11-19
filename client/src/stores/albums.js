import { defineStore } from "pinia";
import api from "../services/api.service";

export const useAlbumsStore = defineStore("albums", {
  state: () => ({
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
  }),
  getters: {
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
    rotationAlbums: (state) => (date) => {
      return [
        ...state.tagCollections.heavy_rotation.albums,
        ...state.tagCollections.light_rotation.albums,
      ]
        .filter((album) => new Date(album.import_timestamp) > date)
        .sort((a, b) => {
          if (!a.album_artist && !b.album_artist) {
            return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
          }
          if (!a.album_artist) return 1;
          if (!b.album_artist) return -1;
          return a.album_artist.name.toLowerCase() <
            b.album_artist.name.toLowerCase()
            ? -1
            : 1;
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
  },
  actions: {
    async getRecentAlbums(offset = 0) {
      if (this.recent.albums.length === 0 || offset > 0) {
        this.loadingTagCollections.recent = true;
        const response = await api.getRecentAlbums({
          offset,
        });
        this.recent = {
          albums: this.recent.albums.concat(response.albums),
          more: typeof response.nextPageCursor === "string",
        };
        this.loadingTagCollections.recent = false;
      }
    },
    async getMoreRecentAlbums() {
      await this.getRecentAlbums({
        offset: this.recent.albums.length,
      });
    },
    async getTaggedAlbums({ tag, limit = 25, offset = 0 } = {}) {
      if (this.tagCollections[tag].albums.length === 0 || offset > 0) {
        this.loadingTagCollections[tag] = true;

        const response = await api.getTaggedAlbums({
          tag,
          limit,
          offset,
        });

        const more = typeof response.nextPageCursor === "string";
        const albums = this.tagCollections[tag].albums.concat(response.albums);
        this.tagCollections[tag] = {
          albums,
          more,
        };

        this.loadingTagCollections[tag] = false;
      }
    },
    async getMoreTaggedAlbums({ tag, limit = 25 } = {}) {
      await this.getTaggedAlbums({
        tag,
        limit,
        offset: this.tagCollections[tag].albums.length,
      });
    },
    async getAlbum(id) {
      if (!this.albums[id]) {
        const album = await api.getAlbum(id);
        this.albums[album.album_id.value] = album;
      }
    },
  },
});
