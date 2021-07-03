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
      <span v-if="element.album.label" class="me-1 text-muted"
        >&middot; {{ element.album.label }}</span
      >
      <span v-if="element.album.year" class="me-1 text-muted"
        >&middot; {{ element.album.year }}</span
      >
    </div>
    <TagList :tags="element.album.current_tags" />
    <div class="text-muted">{{ element.notes }}</div>
  </div>
</template>

<script>
import AlbumTitleLink from "../music/AlbumTitleLink.vue";
import ArtistLink from "../music/ArtistLink.vue";
import TagList from "../music/TagList.vue";

export default {
  name: "AlbumItem",
  components: { AlbumTitleLink, ArtistLink, TagList },
  props: {
    element: Object,
  },
};
</script>
