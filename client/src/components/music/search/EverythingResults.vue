<template>
  <div>
    <AlbumResults />
    <TrackResults />
    <ArtistResults />
    <DocumentResults v-if="searchTerm" />
  </div>
</template>

<script>
import AlbumResults from "./album/AlbumResults.vue";
import TrackResults from "./track/TrackResults.vue";
import ArtistResults from "./artist/ArtistResults.vue";
import DocumentResults from "./document/DocumentResults.vue";

export default {
  name: "EverythingResults",
  components: { AlbumResults, TrackResults, ArtistResults, DocumentResults },
  computed: {
    searchTerm() {
      return this.$route.query.term;
    },
  },
};
</script>
