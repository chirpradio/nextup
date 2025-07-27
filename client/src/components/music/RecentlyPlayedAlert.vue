<template>
  <div
    v-if="recentPlay"
    class="alert alert-secondary p-2"
    :class="classes"
    role="alert"
  >
    <font-awesome-icon icon="fa-circle-pause" fade class="slow-fade" />
    {{ object_word }}played by {{ dj }} at {{ time }}
  </div>
</template>

<style scoped>
.fit-content {
  width: fit-content;
}

.shrink {
  font-size: 0.875rem;
}

.slow-fade {
  --fa-animation-duration: 2.5s;
}
</style>

<script>
import { mapStores } from "pinia";
import { usePlaylistStore } from "@/playlist/playlistStore";

export default {
  props: {
    album: Object,
    fitContent: {
      type: Boolean,
      default: true,
    },
    shrink: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapStores(usePlaylistStore),
    recentPlay() {
      return this.playlistStore.recentPlay(this.album);
    },
    object_word() {
      let action = "";
      if (this.album?.id === this.recentPlay.album.__key?.name) {
        action = "album ";
      } else if (
        this.album.album_artist?.id === this.recentPlay.album.album_artist?.name
      ) {
        action = "artist ";
      }
      return action;
    },
    dj() {
      let name = "";
      const user = this.recentPlay?.selector;
      if (user) {
        name = `${user.first_name} ${user.last_name}`;
      }
      return name;
    },
    time() {
      if (this.recentPlay?.established) {
        const played = new Date(this.recentPlay.established);
        return played.toLocaleTimeString("en-us", {
          timeZone: "America/Chicago",
          timeStyle: "short",
        });
      }
      return "";
    },
    classes() {
      return {
        "fit-content": this.fitContent,
        shrink: this.shrink,
      };
    },
  },
};
</script>
