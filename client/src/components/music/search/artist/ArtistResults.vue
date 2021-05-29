<template>
  <Results 
    type="artists" 
    linkPath="/library/search/artist" 
    :results="results" 
    :showAllLink="showAllLink"
    :showHeader="showHeader" 
    :showPagination="showPagination" >

    <template v-slot:rows>
      <ArtistResultRows :results="results" />
    </template>
  </Results>
</template>

<script>
import ArtistResultRows from "./ArtistResultRows";
import Results from "../Results";

export default {
  name: "ArtistResults",
  components: { ArtistResultRows, Results, },
  props: {
    showAllLink: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showPagination: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    results () {
      const defaultResults = {
        hits: [],
        count: undefined,
      };

      return this.$store.getters.results.artist || defaultResults;
    },
  }
}
</script>