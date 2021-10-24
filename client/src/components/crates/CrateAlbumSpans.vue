<template>
  <AlbumTitleLink :album="album" class="fst-italic me-1" />
  <span v-if="labelOrYear" class="text-muted">(</span>
  <span v-if="album.label" class="me-1 text-muted">{{ album.label }}</span>
  <span v-if="labelAndYear" class="me-1 text-muted">&middot;</span>
  <span v-if="album.year" class="text-muted">{{ album.year }}</span>
  <span v-if="labelOrYear" class="text-muted">)</span>
</template>

<script>
import AlbumTitleLink from "../music/AlbumTitleLink";

export default {
  name: "CrateAlbumSpans",
  components: { AlbumTitleLink },
  props: {
    album: Object,
  },
  computed: {
    labelAndYear() {
      return this.album.label && this.album.year;
    },
    labelOrYear() {
      return this.album.label || this.album.year;
    },
  },
};
</script>
