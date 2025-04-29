<template>
  <PlayButton
    v-if="!recentPlay"
    :album="album"
    :categories="album.current_tags"
    :track="track"
    class="me-2"
  />
  <AddToCrate :keyToAdd="track.__key" class="w-auto" />
  <RecentlyPlayedAlert
    v-if="showAlert"
    :album="album"
    :fitContent="false"
    class="recently-played-alert mt-2 mb-0 col-5"
  />
</template>

<style scoped>
.recently-played-alert {
  font-size: 0.875rem;
}
</style>

<script>
import AddToCrate from "../../../AddToCrate.vue";
import PlayButton from "../../PlayButton.vue";
import { mapStores } from "pinia";
import { usePlaylistStore } from "@/playlist/playlistStore";
import RecentlyPlayedAlert from "../../RecentlyPlayedAlert.vue";

export default {
  components: { AddToCrate, PlayButton, RecentlyPlayedAlert },
  props: {
    album: Object,
    track: Object,
  },
  computed: {
    ...mapStores(usePlaylistStore),
    recentPlay() {
      return this.playlistStore.recentPlay(this.album);
    },
    onAir() {
      return this.playlistStore.onAir;
    },
    showAlert() {
      return this.recentPlay && this.onAir;
    },
  },
};
</script>
