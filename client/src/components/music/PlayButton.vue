<template>
  <button
    v-if="onAir"
    class="btn btn-sm btn-outline-chirp-red play-button"
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
</template>

<style>
.play-button {
  height: fit-content;
  width: 80%;
  text-align: left;
  background: var(--bright-red);
  background-image: linear-gradient(
    to right,
    var(--bright-red) 50%,
    rgba(255, 255, 255, 1) 50%
  );
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 0.25s linear;
}

@media (min-width: 768px) {
  .play-button {
    width: 10em;
    min-width: 10em;
  }
}

.play-button__holding {
  color: white !important;
  background-position: left bottom;
  transition: all 2.5s linear;
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
      timeout: undefined,
    };
  },
  computed: {
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
        return "check-circle";
      } else if (this.error) {
        return "xmark";
      } else {
        return "play";
      }
    },
    label() {
      if (this.added) {
        return "Added";
      } else if (this.holding) {
        return "Adding...";
      } else if (this.error) {
        return "Error";
      } else {
        return "Hold to play";
      }
    },
    onAir() {
      return this.$store.state.playlist.onAir;
    },
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
        this.timeout = setTimeout(this.addToPlaylist, 2500);
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
    async addToPlaylist() {
      this.confirmed = true;
      try {
        if (this.type === "track") {
          await this.$store.dispatch("addPlaylistTrack", {
            album: this.album.__key.path,
            artist: this.trackOrAlbumArtist.__key.path,
            categories: this.categories || [],
            label: this.album.label || null,
            track: this.track.__key.path,
          });
        } else if (this.type === "freeform") {
          await this.$store.dispatch("addFreeformPlaylistTrack", {
            album: this.album,
            artist: this.artist,
            categories: this.categories || [],
            notes: this.notes,
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