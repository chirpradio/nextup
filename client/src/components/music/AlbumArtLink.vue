<template>
  <router-link :to="{ name: 'album', params: { id: album.album_id.value } }">
    <AlbumArt
      :album="album"
      :srcSize="srcSize"
      :imgSize="imgSize"
      class="img-thumbnail"
    />
  </router-link>
</template>

<script>
import AlbumArt from "./AlbumArt";

export default {
  name: "AlbumArtLink",
  components: { AlbumArt },
  props: {
    album: Object,
    imgSize: {
      type: String,
      default: "med",
    },
    srcSize: {
      type: String,
      default: "lg",
    },
  },
};
</script>
