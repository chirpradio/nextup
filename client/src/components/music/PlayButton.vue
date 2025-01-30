<template>
  <div v-if="onAir" class="btn-group">
    <button
      class="cue-button btn btn-sm btn-outline-chirp-red bg-white d-flex d-flex-row align-items-center"
      @click="cue"
      :disabled="cued"
    >
      <font-awesome-icon icon="clock" size="sm" class="me-1" />
      {{ cuedLabel }}
    </button>
    <button
      type="button"
      class="play-button btn btn-sm btn-outline-chirp-red dropdown-toggle dropdown-toggle-split bg-white d-flex d-flex-row align-items-center"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      :disabled="disabled"
    >
      <font-awesome-icon :icon="playIcon" class="me-1" size="sm" />
      <span class="me-1 flex-fill text-start">{{ playLabel }}</span>
    </button>
    <div class="dropdown-menu play-button-menu p-2">
      <div
        class="d-flex d-flex-row align-items-baseline justify-content-between"
      >
        <label class="form-label" for="notes">Notes</label>
        <span class="form-text ms-1">optional</span>
      </div>
      <textarea
        class="form-control form-control-sm mb-2"
        id="notes"
        v-model="playNotes"
      ></textarea>
      <button
        class="btn btn-sm btn-chirp-red w-100 mb-2"
        :disabled="adding"
        @click="addToPlaylist"
      >
        add to playlist
      </button>
    </div>
  </div>
</template>

<style>
.cue-button,
.play-button {
  height: fit-content;
}

.cue-button {
  min-width: 4.25rem;
}

.play-button {
  min-width: 5.25rem;
}

.play-button-menu {
  font-size: 0.875rem;
  box-shadow: 5px 5px 10px -4px #000000;
}
</style>

<script>
import { mapStores } from "pinia";
import { usePlaylistStore } from "@/playlist/store";

export default {
  props: {
    album: Object,
    artist: Object,
    categories: Array,
    notes: {
      type: String,
      default: "",
    },
    track: Object,
    type: {
      type: String,
      default: "track",
      validator(value) {
        return ["freeform", "track"].includes(value);
      },
    },
  },
  data() {
    return {
      added: false,
      adding: false,
      error: false,
      playNotes: "",
    };
  },
  computed: {
    ...mapStores(usePlaylistStore),
    trackOrAlbumArtist() {
      return this.album.is_compilation
        ? this.track.track_artist
        : this.album.album_artist;
    },
    cued() {
      const cuedTrack = this.playlistStore.cuedTrack;
      return (
        cuedTrack?.track.title === this.track.title &&
        cuedTrack?.album.title === this.album.title
      );
    },
    cuedLabel() {
      return this.cued ? "cued" : "cue";
    },
    disabled() {
      return this.added || this.error;
    },
    playIcon() {
      if (this.added) {
        return "check";
      } else if (this.error) {
        return "exclamation";
      } else {
        return "play";
      }
    },
    playLabel() {
      if (this.added) {
        return "added";
      } else if (this.adding) {
        return "adding";
      } else if (this.error) {
        return "error";
      } else {
        return "play";
      }
    },
    onAir() {
      return this.playlistStore.onAir;
    },
    freeformPlaylistTrack() {
      return {
        album: this.album,
        artist: this.artist,
        categories: this.categories || [],
        notes: this.playNotes,
        track: this.track,
      };
    },
  },
  created() {
    /* 
      use value passed in from props
      if a DJ already added notes in their crate
    */
    this.playNotes = this.notes;
  },
  methods: {
    async addToPlaylist() {
      try {
        this.adding = true;
        if (this.type === "track") {
          await this.playlistStore.addPlaylistTrack({
            album: this.album.__key.path,
            artist: this.trackOrAlbumArtist.__key.path,
            categories: this.categories || [],
            label: this.album.label || null,
            track: this.track.__key.path,
            notes: this.playNotes,
          });
        } else if (this.type === "freeform") {
          await this.playlistStore.addFreeformPlaylistTrack(
            this.freeformPlaylistTrack
          );
        }
        this.adding = false;
        this.added = true;
      } catch (error) {
        this.adding = false;
        this.error = true;
        console.error(error);
      }
    },
    cue() {
      let playlistTrack;
      if (this.type === "freeform") {
        playlistTrack = this.freeformPlaylistTrack;
      } else {
        playlistTrack = {
          album: this.album,
          artist: this.trackOrAlbumArtist,
          categories: this.categories || [],
          label: this.album.label || null,
          track: this.track,
          notes: this.playNotes,
        };
      }
      this.playlistStore.cue(playlistTrack);
    },
  },
};
</script>
