<template>
  <Results
    type="tracks"
    linkPath="/library/search/track"
    :results="results"
    :showAllLink="showAllLink"
    :showHeader="showHeader"
    :showPagination="showPagination"
  >
    <template v-slot:headings>
      <TrackResultHeadings class="d-none d-sm-flex" />
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
import updateTitle from "../../../../mixins/updateTitle";

export default {
  name: "TrackResults",
  components: { TrackResultHeadings, TrackResultRows, Results },
  mixins: [updateTitle],
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
    },
  },
  computed: {
    results() {
      const defaultResults = {
        hits: [],
        count: undefined,
      };

      return this.$store.getters.results.track || defaultResults;
    },
  },  
};
</script>
