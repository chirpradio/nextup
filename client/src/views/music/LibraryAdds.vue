<template>
  <AlbumCollection
    :albums="albums"
    :loading="loading"
    :more="more"
    @more="getMore"
  />
</template>

<script>
import AlbumCollection from "@/components/music/AlbumCollection.vue";
import updateTitle from "@/mixins/updateTitle";
import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";

export default {
  name: "LibraryAdds",
  components: {
    AlbumCollection,
  },
  computed: {
    ...mapStores(useAlbumsStore),
    albums() {
      return this.albumsStore.libraryAdds;
    },
    loading() {
      return this.albumsStore.loadingRecentAlbums;
    },
    more() {
      // Boolean that tells the component whether there are more albums to get
      return this.albumsStore.moreRecentAlbums;
    },
  },
  async mounted() {
    this.updateTitle("Library Adds");
    await this.albumsStore.getRecentAlbums();
    while (this.albums.length === 0 && this.more) {
      await this.getMore();
    }
  },
  mixins: [updateTitle],
  methods: {
    async getMore() {
      await this.albumsStore.getMoreRecentAlbums();
    },
  },
};
</script>
