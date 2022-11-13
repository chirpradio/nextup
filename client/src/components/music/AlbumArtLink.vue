<template>
  <router-link :to="{ name: 'album', params: { id: album.album_id.value } }">
    <AlbumArt :album="album" :srcSize="srcSize" class="img-thumbnail" />
  </router-link>
</template>

<script>
import AlbumArt from "./AlbumArt.vue";

export default {
  name: "AlbumArtLink",
  components: { AlbumArt },
  props: {
    album: Object,
    srcSize: {
      type: String,
      default: "lg",
    },
  },
};
</script>
