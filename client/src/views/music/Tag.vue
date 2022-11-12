<template>
  <AlbumCollection
    :albums="albums"
    :loading="loading"
    :more="more"
    @more="getMore"
    sortBy="album_artist.name"
  />
</template>

<script>
import AlbumCollection from "../../components/music/AlbumCollection";
import formatters from "../../mixins/formatters";
import updateTitle from "../../mixins/updateTitle";
import { mapStores } from "pinia";
import { useAlbumsStore } from "../../stores/albums";

const limit = 100;

export default {
  name: "TagView",
  props: {
    tag: String,
  },
  components: {
    AlbumCollection,
  },
  mixins: [formatters, updateTitle],
  computed: {
    ...mapStores(useAlbumsStore),
    albums() {
      return this.albumsStore.taggedAlbums(this.tag);
    },
    loading() {
      return this.albumsStore.loadingTaggedAlbums(this.tag);
    },
    more() {
      // Boolean that tells the component whether there are more albums to get
      return this.albumsStore.moreAlbumsWithTag(this.tag);
    },
  },
  created() {
    this.getTaggedAlbums();
  },
  updated() {
    this.updateTitle(this.formatTag(this.tag));
  },
  watch: {
    tag: "getTaggedAlbums",
  },
  methods: {
    getTaggedAlbums() {
      this.albumsStore.getTaggedAlbums({ tag: this.tag, limit });
    },
    getMore() {
      this.albumsStore.getMoreTaggedAlbums({ tag: this.tag, limit });
    },
  },
};
</script>
