<template>
  <img :src="imgSrc" :class="classObject" @error="onError" />
</template>

<style>
.album_art__sm {
  height: 34px;
  width: 34px;
}

.album_art__med {
  height: 64px;
  width: 64px;
}

.album_art__lg {
  height: 174px;
  width: 174px;
}

.album_art__xl {
  height: 272px;
  width: 272px;
}
</style>

<script>
import defaultAlbumArt from "../../assets/default-album-art.png";

export default {
  name: "AlbumArt",
  data() {
    return { broken: false };
  },
  props: {
    album: Object,
    srcSize: {
      type: String,
      default: "med",
    },
  },
  computed: {
    classObject() {
      const obj = {};
      obj[`album_art__${this.srcSize}`] = true;
      return obj;
    },
    imgSrc() {
      const src = this.album[`lastfm_${this.srcSize}_image_url`];
      if (this.broken || !src) {
        return defaultAlbumArt;
      }
      return src;
    },
  },
  methods: {
    onError() {
      this.broken = true;
    },
  },
};
</script>
