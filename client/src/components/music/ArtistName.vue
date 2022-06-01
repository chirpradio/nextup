<template>
  <span v-if="album.is_compilation">Compilation</span>
  <span v-if="!album.is_compilation">
    <span v-if="includeBy">by </span>
    <ArtistLink :artist="album.album_artist" />
  </span>
</template>

<script>
import ArtistLink from "./ArtistLink.vue";

export default {
  components: { ArtistLink },
  props: {
    album: Object,
    includeBy: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
