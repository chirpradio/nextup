<template>
  <router-link
    :to="{ name: 'album', params: { id: album.album_id.value } }"
    class="d-inline-block"
    :class="classObject"
  >
    <AlbumArt :album="album" :srcSize="srcSize" class="border w-100" />
  </router-link>
</template>

<style>
.album-art__sm {
  height: 34px;
  width: 34px;
}

.album-art__med {
  height: 64px;
  width: 64px;
}

.album-art__lg {
  height: 174px;
  width: 174px;
}

.album-art__xl {
  height: 272px;
  width: 272px;
}
</style>

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
  computed: {
    classObject() {
      const obj = {};
      obj[`album-art__${this.srcSize}`] = true;
      return obj;
    },
  },
};
</script>
