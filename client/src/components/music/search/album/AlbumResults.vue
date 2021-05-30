<template>
  <Results 
    type="albums" 
    linkPath="/library/search/album" 
    :results="results" 
    :showAllLink="showAllLink"
    :showHeader="showHeader" 
    :showPagination="showPagination" >

    <template v-slot:headings>
      <AlbumResultHeadings class="d-none d-sm-flex" />
    </template>
    <template v-slot:rows>
      <AlbumResultRows :results="results" />
    </template>
  </Results>
</template>

<script>
import Results from "../Results";
import AlbumResultHeadings from "./AlbumResultHeadings";
import AlbumResultRows from "./AlbumResultRows";

export default {
  name: "AlbumResults",
  components: { AlbumResultHeadings, AlbumResultRows, Results, },
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

      return this.$store.getters.results.album || defaultResults;
    },
  }
}
</script>