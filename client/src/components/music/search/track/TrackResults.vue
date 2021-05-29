<template>
  <Results 
    type="tracks" 
    linkPath="/library/search/track" 
    :results="results" 
    :showAllLink="showAllLink"
    :showHeader="showHeader" 
    :showPagination="showPagination" >

    <template v-slot:headings>
      <TrackResultHeadings />
    </template>
    <template v-slot:rows>
      <TrackResultRows :results="results" />
    </template>
  </Results>
</template>

<script>
import Results from "../Results";
import TrackResultHeadings from "./TrackResultHeadings";
import TrackResultRows from "./TrackResultRows";

export default {
  name: "TrackResults",
  components: { TrackResultHeadings, TrackResultRows, Results, },
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

      return this.$store.getters.results.track || defaultResults;
    },
  }
}
</script>