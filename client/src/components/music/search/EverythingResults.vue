<template>
  <div>
    <AlbumResults />
    <TrackResults />
    <ArtistResults />
    <DocumentResults v-if="searchTerm" />
  </div>
</template>

<script>
import AlbumResults from "./album/AlbumResults";
import TrackResults from "./track/TrackResults";
import ArtistResults from "./artist/ArtistResults";
import DocumentResults from "./document/DocumentResults";

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
