<template>
  <AddToCrate :keyToAdd="track.__key" class="w-auto me-2" />
  <PlayButton
    v-if="!recentPlay"
    :album="album"
    :categories="album.current_tags"
    :track="track"
    class=""
  />
  <RecentlyPlayedAlert
    v-if="showAlert"
    :album="album"
    :fitContent="false"
    class="recently-played-alert mt-2 mb-0 col-11"
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
import { usePlaylistStore } from "@/stores/playlist";
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
