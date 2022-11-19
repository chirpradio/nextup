<template>
  <img :src="imgSrc" :class="classObject" @error="onError" />
</template>

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
