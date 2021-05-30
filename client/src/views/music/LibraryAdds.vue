<template>
  <AlbumCollection
    :albums="albums"
    :loading="loading"
    :more="more"
    @more="getMore"
  />
</template>

<script>
import AlbumCollection from "../../components/music/AlbumCollection";

export default {
  name: "LibraryAdds",
  title: "Library Adds",
  components: {
    AlbumCollection,
  },
  computed: {
    albums() {
      return this.$store.getters.libraryAdds;
    },
    loading() {
      return this.$store.getters.loadingRecentAlbums;
    },
    more() {
      // Boolean that tells the component whether there are more albums to get
      return this.$store.getters.moreRecentAlbums;
    },
  },
  mounted() {
    this.$store.dispatch("getRecentAlbums");
  },
  methods: {
    getMore() {
      this.$store.dispatch("getMoreRecentAlbums");
    },
  },
};
</script>
