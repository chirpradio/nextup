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
import updateTitle from "../../mixins/updateTitle";

export default {
  name: "LibraryAdds",
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
  async mounted() {
    this.updateTitle("Library Adds");
    await this.$store.dispatch("getRecentAlbums");    
    while(this.albums.length === 0 && this.more) {
      await this.getMore();
    }
  },
  mixins: [updateTitle],
  methods: {
    async getMore() {
      await this.$store.dispatch("getMoreRecentAlbums");
    },
  },
};
</script>
