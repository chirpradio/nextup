<template>
  <Results
    type="albums"
    linkPath="/library/search/album"
    :results="results"
    :showAllLink="showAllLink"
    :showHeader="showHeader"
    :showPagination="showPagination"
  >
    <template v-slot:headings>
      <AlbumResultHeadings class="d-none d-sm-flex" />
    </template>
    <template v-slot:rows>
      <AlbumResultRows :results="results" />
    </template>
  </Results>
</template>

<script>
import Results from "../ResultsTemplate.vue";
import AlbumResultHeadings from "./AlbumResultHeadings.vue";
import AlbumResultRows from "./AlbumResultRows.vue";
import { mapStores } from "pinia";
import { useSearchStore } from "@/stores/search";

export default {
  name: "AlbumResults",
  components: { AlbumResultHeadings, AlbumResultRows, Results },
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

      return this.searchStore.results.album || defaultResults;
    },
  },
};
</script>
