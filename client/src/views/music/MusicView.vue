<template>
  <div class="container-fluid">
    <BreadCrumbs v-if="!this.$route.meta.hideBreadcrumb" />
    <router-view />
  </div>
</template>

<script>
import BreadCrumbs from "@/components/music/BreadCrumbs.vue";
import { mapStores } from "pinia";
import { usePlaylistStore } from "@/playlist/playlistStore";

export default {
  components: { BreadCrumbs },
  computed: {
    ...mapStores(usePlaylistStore),
  },
  created() {
    this.playlistStore.pollRotationPlays();
    this.playlistStore.pollRecentPlays();
  },
};
</script>
