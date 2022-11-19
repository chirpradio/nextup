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
import Results from "../ResultsTemplate.vue";
import TrackResultHeadings from "./TrackResultHeadings.vue";
import TrackResultRows from "./TrackResultRows.vue";
import updateTitle from "../../../../mixins/updateTitle";
import { mapStores } from "pinia";
import { useSearchStore } from "@/stores/search";

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
    ...mapStores(useSearchStore),
    results() {
      const defaultResults = {
        hits: [],
        count: undefined,
      };

      return this.searchStore.results.track || defaultResults;
    },
  },
};
</script>
