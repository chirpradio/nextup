<template>
  <Results
    type="reviews"
    linkPath="/library/search/review"
    :results="results"
    :showAllLink="showAllLink"
    :showHeader="showHeader"
    :showPagination="showPagination"
  >
    <template v-slot:headings>
      <DocumentResultHeadings />
    </template>
    <template v-slot:rows>
      <DocumentResultRows :results="results" />
    </template>
  </Results>
</template>

<script>
import DocumentResultHeadings from "./DocumentResultHeadings";
import DocumentResultRows from "./DocumentResultRows";
import Results from "../Results";

export default {
  name: "DocumentResults",
  components: { DocumentResultHeadings, DocumentResultRows, Results },
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

      return this.$store.getters.results.document || defaultResults;
    },
  },
};
</script>
