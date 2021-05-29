<template>
  <AlbumCollection 
    :albums="albums" 
    :loading="loading"
    :more="more" 
    @more="getMore" 
  />
</template>

<script>
import AlbumCollection from "../../components/music/AlbumCollection"
import formatters from "../../mixins/formatters"

export default {
  name: "TagView",
  props: {
    tag: String,
  },
  components: {
    AlbumCollection,
  },
  mixins: [formatters],
  computed: {
    albums () {
      return this.$store.getters.taggedAlbums(this.tag);
    },
    loading () {
      return this.$store.getters.loadingTaggedAlbums(this.tag);
    },
    more () {
      // Boolean that tells the component whether there are more albums to get
      return this.$store.getters.moreAlbumsWithTag(this.tag);
    },
  },
  title: function () {
    return this.formatTag(this.tag);
  },
  created () {
    this.getTaggedAlbums();
  },
  watch: {    
    "tag": "getTaggedAlbums"
  },
  methods: {
    getTaggedAlbums () {
      this.$store.dispatch("getTaggedAlbums", this.tag);
    },
    getMore () {
      this.$store.dispatch("getMoreTaggedAlbums", this.tag);      
    },
  }
}
</script>