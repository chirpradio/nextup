<template>
  <img :src="imgSrc" :class="classObject" @error="onError">  
</template>

<style scoped>
  .album_art__med {
    height: 4.5rem;
    width: 4.5rem;
  }

  .album_art__lg {
    height: 11.5rem;
    width: 11.5rem;    
  }
</style>

<script>
export default {
  name: "AlbumArt",
  data() {
    return { broken: false }
  },
  props: {
    album: Object,
    imgSize: {
      type: String,
      default: "med",
    },
    srcSize: {
      type: String,
      default: "lg",
    }
  },
  computed: { 
    classObject () {
      const obj = {};

      if(this.imgSize === 'fluid') {
        obj["img-fluid"] = true;
      } else {
        obj[`album_art__${this.imgSize}`] = true;
      }
      
      return obj;
    },  
    imgSrc () {
      const src = this.album[`lastfm_${this.srcSize}_image_url`];
      if(this.broken || !src) {
        return `${process.env.BASE_URL}default-album-art.png`;
      }
      return src;
    }
  },
  methods: {
    onError () {
      this.broken = true;
    }
  }
}
</script>