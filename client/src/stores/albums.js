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
      local_current: {
        albums: [],
        more: false,
      },
      local_classic: {
        albums: [],
        more: false,
      },
      /*
        "recent" is not an actual tag, but treating it like one
        here in the store makes the code below more reusable
      */
      recent: {
        albums: [],
        more: false,
      },
    },
    loadingTagCollections: {
      heavy_rotation: false,
      light_rotation: false,
      local_current: false,
      local_classic: false,
      recent: false,
    },
    albums: {},
  }),
  getters: {
    recentAlbums: (state) => {
      return state.tagCollections["recent"].albums;
    },
    moreRecentAlbums: (state) => {
      return state.tagCollections["recent"].more;
    },
    loadingRecentAlbums: (state) => {
      return state.loadingTagCollections.recent;
    },
    libraryAdds: (state) => {
      return state.tagCollections["recent"].albums.filter((album) => {
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
    async getRecentAlbums({ limit = 25, offset = 0 } = {}) {
      await this.getTaggedAlbums({
        tag: "recent",
        limit,
        offset,
      });
    },
    async getMoreRecentAlbums() {
      await this.getTaggedAlbums({
        tag: "recent",
        offset: this.tagCollections.recent.albums.length,
      });
    },
    async getTaggedAlbums({ tag, limit = 25, offset = 0 } = {}) {
      const loading = this.loadingTagCollections[tag];
      const empty = this.tagCollections[tag].albums.length === 0;
      const gettingMore = offset > 0;

      if (!loading && (empty || gettingMore)) {
        this.loadingTagCollections[tag] = true;

        const fetchFunction =
          tag === "recent" ? api.getRecentAlbums : api.getTaggedAlbums;
        const response = await fetchFunction({
          tag,
          limit,
          offset,
        });

        for (const album of response.albums) {
          const taggedAlbums = this.tagCollections[tag].albums;
          const index = taggedAlbums.findIndex(
            (item) => item.album_id.value === album.album_id.value
          );
          if (index > -1) {
            taggedAlbums.splice(index, 1, album);
          } else {
            taggedAlbums.push(album);
          }
        }
        this.tagCollections[tag].more =
          typeof response.nextPageCursor === "string";

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
    async updateTrackTags({ album_id, track, tags } = {}) {
      const oldTags = [...track.current_tags];
      track.current_tags = tags;
      try {
        await api.updateTrackTags(album_id, track.track_num, tags);
      } catch (error) {
        track.current_tags = oldTags;
      }
    },
    async updateAlbumTags({ album, tags } = {}) {
      const oldTags = album.current_tags ? [...album.current_tags] : [];
      album.current_tags = tags;
      try {
        await api.updateAlbumTags(album.album_id, tags);
      } catch (error) {
        album.current_tags = oldTags;
      }
    },
  },
});
