import { defineStore } from "pinia";
import { api } from "../services/api.service";

let intervalID;
const ROTATION_PLAY_WINDOW = 4; // hours
const ROTATION_PLAY_POLLING_INTERVAL = 5 * 60 * 1000; // every five minutes

export const usePlaylistStore = defineStore("playlist", {
  state: () => ({
    adding: false,
    cuedTrack: undefined,
    events: [],
    lastUpdated: undefined,
    onAir: false,
    recentPlays: [],
    selectedAlbumId: undefined,
  }),
  getters: {
    recentPlay: (state) => (album) => {
      const albumId = album.id ?? album.__key?.name;
      const artistId = album.album_artist?.id;

      const albumPlay = state.recentPlays.find(
        (play) => play.album?.__key?.name === albumId
      );

      if (albumPlay) {
        return { kind: "album", play: albumPlay };
      }
      if (artistId) {
        const artistPlay = state.recentPlays.find(
          (play) => play.artist?.id === artistId
        );
        if (artistPlay) {
          return { kind: "artist", play: artistPlay };
        }
      }
      return null;
    },
  },
  actions: {
    async addBreak() {
      this.adding = true;
      await api.post("/playlist/break");
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    async addFreeformPlaylistTrack(data) {
      this.adding = true;
      await api.post("/playlist/freeform", data);
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    async addPlaylistTrack(data) {
      this.adding = true;
      await api.post("/playlist/track", data);
      this.adding = false;
      this.getPlaylistEvents({ start: this.lastUpdated });
    },
    clearCuedTrack() {
      this.cuedTrack = undefined;
    },
    cue(track) {
      this.cuedTrack = track;
    },
    async deletePlaylistEvent(event) {
      const index = this.events.findIndex((element) => element.id === event.id);
      this.events.splice(index, 1);
      await api.delete(`/playlist/${event.id}`);
    },
    async getPlaylistEvents({ start, end } = {}) {
      const options = {};
      if (start || end) {
        const params = {};
        if (start) {
          params.start = start;
        }
        if (end) {
          params.end = end;
        }
        options.params = params;
      }

      const { data: events } = await api.get("/playlist", options);
      for (const event of events) {
        const index = this.events.findIndex((item) => item.id === event.id);
        if (index > -1) {
          this.events.splice(index, 1, event);
        } else {
          this.events.push(event);
        }
      }
      this.lastUpdated = Date.now();
    },
    async getRecentPlays() {
      try {
        const start = new Date();
        start.setHours(start.getHours() - ROTATION_PLAY_WINDOW);
        const { data: recentPlays } = await api.get("/playlist/", {
          params: {
            start: start.getTime(),
          },
        });
        this.recentPlays = recentPlays;
      } catch (error) {
        clearInterval(intervalID);
        intervalID = undefined;
      }
    },
    async pollRecentPlays() {
      this.getRecentPlays();
      if (!intervalID) {
        intervalID = setInterval(
          this.getRecentPlays,
          ROTATION_PLAY_POLLING_INTERVAL
        );
      }
    },
    selectAlbum(id) {
      this.selectedAlbumId = id;
    },
  },
  persist: {
    paths: ["onAir"],
  },
});
