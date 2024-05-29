<template>
  <AlbumTitleLink :album="album" class="fst-italic me-1" />
  <span v-if="labelOrYear" class="text-muted">(</span>
  <AlbumLabelLink
    v-if="album.label"
    class="me-1 text-muted"
    :albumLabel="album.label"
  />
  <span v-if="labelAndYear" class="me-1 text-muted">&middot;</span>
  <AlbumYearLink v-if="album.year" class="text-muted" :albumYear="album.year" />
  <span v-if="labelOrYear" class="text-muted">)</span>
</template>

<script>
import AlbumTitleLink from "../music/AlbumTitleLink.vue";
import AlbumLabelLink from "../music/AlbumLabelLink.vue";
import AlbumYearLink from "../music/AlbumYearLink.vue";

export default {
  name: "CrateAlbumSpans",
  components: { AlbumTitleLink, AlbumLabelLink, AlbumYearLink },
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
