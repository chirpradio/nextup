<template>
  <div>
    <div class="mb-1">
      <ArtistLink
        v-if="element.artist"
        :artist="element.artist"
        class="fw-bold me-1"
      />
      <span v-if="element.artist" class="me-1">&middot;</span>
      <AlbumTitleLink :album="element.album" class="fst-italic me-1" />
      <span v-if="element.album.label" class="me-1"
        >&middot; {{ element.album.label }}</span
      >
      <span v-if="element.album.year" class="me-1"
        >&middot; {{ element.album.year }}</span
      >
    </div>
    <div class="text-muted">{{ element.notes }}</div>
  </div>
</template>

<script>
import AlbumTitleLink from "../music/AlbumTitleLink.vue";
import ArtistLink from "../music/ArtistLink.vue";

export default {
  name: "AlbumItem",
  components: { AlbumTitleLink, ArtistLink },
  props: {
    element: Object,
  },
};
</script>
