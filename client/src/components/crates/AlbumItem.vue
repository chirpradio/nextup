<template>
  <div class="d-flex flex-column flex-md-row">
    <div class="d-flex flex-column flex-grow-1">
      <div class="mb-1">
        <ArtistLink
          v-if="element.artist"
          :artist="element.artist"
          class="fw-bold me-2"
        />
        <CrateAlbumSpans :album="element.album" />
      </div>
      <TagList :tags="element.album.current_tags" :album="element.album" />
    </div>
    <PlayButton
      :album="element.album"
      :categories="element.album.current_tags"
      type="freeform"
      class="mt-2 mt-md-0"
    />
  </div>
</template>

<script>
import CrateAlbumSpans from "./CrateAlbumSpans.vue";
import ArtistLink from "../music/ArtistLink.vue";
import TagList from "../music/TagList.vue";
import PlayButton from "../music/PlayButton.vue";

export default {
  name: "AlbumItem",
  components: { ArtistLink, CrateAlbumSpans, TagList, PlayButton },
  props: {
    element: Object,
  },
};
</script>
