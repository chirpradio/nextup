<template>
  <div>
    <RecordSpinner v-if="loading" />
    <div v-if="!loading">
      <h1 class="mb-3">{{ artist.name }}</h1>
      <AddToCrate :keyToAdd="artist.__key" class="col-4 col-md-3 mb-3" />
      <AlbumCollection :albums="albums" sortBy="year" :hideArtistLinks="true" />
    </div>
  </div>
</template>

<script>
import AddToCrate from "../../components/AddToCrate.vue";
import RecordSpinner from "../../components/RecordSpinner";
import AlbumCollection from "../../components/music/AlbumCollection";
import updateTitle from "../../mixins/updateTitle";

export default {
  components: { AddToCrate, AlbumCollection, RecordSpinner },
  data() {
    return {
      loading: true,
    };
  },
  props: {
    id: String,
  },
  computed: {
    artist() {
      return this.$store.getters.artist(this.id);
    },
    albums() {
      return this.$store.getters.artistAlbums(this.id);
    },
  },
  created() {
    this.getArtist();
  },
  mixins: [updateTitle],
  methods: {
    async getArtist() {
      this.loading = true;
      await this.$store.dispatch("getArtist", this.id);
      await this.$store.dispatch("getArtistAlbums", this.id);
      this.loading = false;
      this.updateTitle(this.artist.name);
    },
  },
};
</script>
