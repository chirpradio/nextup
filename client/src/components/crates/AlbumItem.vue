<template>
  <div>
    <div class="mb-1">
      <ArtistLink
        v-if="element.artist"
        :artist="element.artist"
        class="fw-bold me-2"
      />
      <CrateAlbumSpans :album="element.album" />
    </div>
    <TagList :tags="element.album.current_tags" />
    <div class="text-muted">{{ element.notes }}</div>
  </div>
</template>

<script>
import CrateAlbumSpans from "./CrateAlbumSpans.vue";
import ArtistLink from "../music/ArtistLink.vue";
import TagList from "../music/TagList.vue";

export default {
  name: "AlbumItem",
  components: { ArtistLink, CrateAlbumSpans, TagList },
  props: {
    element: Object,
  },
};
</script>
