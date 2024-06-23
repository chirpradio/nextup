<template>
  <div class="d-flex flex-column flex-md-row">
    <div class="d-flex flex-column flex-grow-1">
      <div class="mb-1">
        <ArtistLink :artist="element.artist" class="fw-bold me-2" />
        <span class="me-1">“{{ element.track.title }}” from</span>
        <CrateAlbumSpans :album="element.album" />
      </div>
      <TagList :tags="element.album.current_tags" />
    </div>
    <PlayButton
      v-if="!recentPlay"
      :album="element.album"
      :categories="element.album.current_tags"
      :track="element.track"
      class="mt-2 mt-md-0"
    />
    <RecentlyPlayedAlert
      v-if="recentPlay"
      :album="element.album"
      :shrink="true"
    />
  </div>
</template>

<script>
import ArtistLink from "../music/ArtistLink.vue";
import CrateAlbumSpans from "./CrateAlbumSpans.vue";
import TagList from "../music/TagList.vue";
import PlayButton from "../music/PlayButton.vue";
import { mapStores } from "pinia";
import { usePlaylistStore } from "@/playlist/store";
import RecentlyPlayedAlert from "../music/RecentlyPlayedAlert.vue";

export default {
  name: "TrackItem",
  components: {
    ArtistLink,
    CrateAlbumSpans,
    TagList,
    PlayButton,
    RecentlyPlayedAlert,
  },
  props: {
    element: Object,
  },
  computed: {
    ...mapStores(usePlaylistStore),
    recentPlay() {
      return this.playlistStore.recentPlay(this.element.album);
    },
  },
};
</script>
