<template>
  <div v-if="onAir" class="btn-group">
    <button
      class="btn btn-sm btn-outline-chirp-red play-button fit-content"
      data-reference="parent"
      :class="buttonClasses"
      :disabled="disabled"
      @mousedown="startConfirmation"
      @touchstart="startConfirmation"
      @mouseup="endConfirmation"
      @mouseout="endConfirmation"
      @touchend="endConfirmation"
      @keypress="keyStartConfirmation"
      @keyup="keyEndConfirmation"
    >
      <font-awesome-icon :icon="icon" :class="iconClasses" size="sm" />
      {{ label }}
    </button>
    <button
      type="button"
      class="btn btn-sm btn-outline-chirp-red dropdown-toggle dropdown-toggle-split play-button__toggle h-fit-content bg-white"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      title="play with a note"
      :disabled="disabled"
    >
      <font-awesome-icon icon="pen" class="me-1" size="sm" />
      <span class="d-none">toggle dropdown</span>
    </button>
    <div class="dropdown-menu play-button__menu p-2">
      <label class="form-label" for="notes">Note</label>
      <textarea
        class="form-control form-control-sm mb-2"
        id="notes"
        v-model="playNotes"
      ></textarea>
      <button
        class="btn btn-sm btn-chirp-red w-100 mb-2"
        :disabled="disabled"
        @click="playWithNote"
      >
        Play with a note
      </button>
    </div>
  </div>
</template>

<style>
.fit-content {
  height: fit-content;
  width: fit-content;
}

.play-button__toggle .svg-inline--fa {
  position: relative;
  top: -1px;
}

.play-button {
  min-width: 8em;
  text-align: left;
  background: var(--bright-red);
  background-image: linear-gradient(
    to right,
    var(--bright-red) 50%,
    rgba(255, 255, 255, 1) 50%
  );
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 0.25s linear !important;
}

@media (min-width: 768px) {
  .play-button {
    /* min-width: 10em; */
  }
}

.play-button__holding {
  color: white !important;
  background-position: left bottom;
  transition: all 2.25s linear !important;
}

.play-button__menu {
  font-size: 0.875rem;
  box-shadow: 5px 5px 10px -4px #000000;
}

.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<script>
import { mapStores } from "pinia";
import { usePlaylistStore } from "../../stores/playlist";

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
    },
  },
  data() {
    return {
      added: false,
      confirmed: false,
      error: false,
      holding: false,
      playNotes: "",
      timeout: undefined,
    };
  },
  computed: {
    ...mapStores(usePlaylistStore),
    trackOrAlbumArtist() {
      return this.album.is_compilation
        ? this.track.track_artist
        : this.album.album_artist;
    },
    buttonClasses() {
      return {
        "play-button__holding": this.holding,
      };
    },
    iconClasses() {
      return {
        blink: this.holding,
      };
    },
    disabled() {
      return this.added || this.error;
    },
    icon() {
      if (this.added) {
        return "circle-check";
      } else if (this.error) {
        return "xmark";
      } else {
        return "play";
      }
    },
    label() {
      if (this.added) {
        return "added";
      } else if (this.holding) {
        return "adding...";
      } else if (this.error) {
        return "error";
      } else {
        return "hold to play";
      }
    },
    onAir() {
      return this.playlistStore.onAir;
    },
  },
  created() {
    /* 
      default to value passed in from props
      but prefer playNotes data() so it's editable
    */
    this.playNotes = this.notes;
  },
  methods: {
    keyStartConfirmation(event) {
      if (event.which === 32) {
        this.startConfirmation();
      }
    },
    startConfirmation() {
      if (!this.added) {
        this.holding = true;
        this.timeout = setTimeout(this.addToPlaylist, 2250);
      }
    },
    keyEndConfirmation(event) {
      if (event.which === 32) {
        this.endConfirmation();
      }
    },
    endConfirmation() {
      if (!this.confirmed) {
        this.holding = false;
        clearTimeout(this.timeout);
      }
    },
    async playWithNote() {
      this.holding = true;
      await this.addToPlaylist();
    },
    async addToPlaylist() {
      this.confirmed = true;
      try {
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
          await this.playlistStore.addFreeformPlaylistTrack({
            album: this.album,
            artist: this.artist,
            categories: this.categories || [],
            notes: this.playNotes,
            track: this.track,
          });
        } else {
          throw new Error(`Invalid type "${this.type}"`);
        }
        this.added = true;
      } catch (error) {
        this.error = true;
        console.error(error);
      }

      this.holding = false;
    },
  },
};
</script>
