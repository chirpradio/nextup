<template>
  <Results
    type="artists"
    linkPath="/library/search/artist"
    :results="results"
    :showAllLink="showAllLink"
    :showHeader="showHeader"
    :showPagination="showPagination"
  >
    <template v-slot:rows>
      <ArtistResultRows :results="results" />
    </template>
  </Results>
</template>

<script>
import ArtistResultRows from "./ArtistResultRows.vue";
import Results from "../Results.vue";
import { mapStores } from "pinia";
import { useSearchStore } from "@/stores/search";

export default {
  name: "ArtistResults",
  components: { ArtistResultRows, Results },
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

      return this.searchStore.results.artist || defaultResults;
    },
  },
};
</script>
