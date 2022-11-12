<template>
  <div>
    <div v-if="showHeader" class="row no-gutters justify-content-between">
      <h1>{{ capitalizedType }}</h1>
    </div>
    <div class="row mb-4">
      <div v-if="!loading && thereAreHits" class="col-sm-12">
        <slot name="headings"></slot>
        <slot name="rows"></slot>
      </div>

      <div
        v-if="showAllLink && thereAreHits && thereAreMoreHits && !loading"
        class="border-top py-2 ps-4"
      >
        <router-link
          class="pl-3"
          :to="{ path: this.linkPath, query: this.$route.query }"
        >
          view all {{ results.count }} {{ type }}...
        </router-link>
      </div>

      <RecordSpinner v-if="loading" />
      <p v-if="!loading && !thereAreHits" class="ml-3">No {{ type }} found</p>
    </div>
    <SearchPagination
      v-if="showPagination && !loading && thereAreHits"
      class="d-flex justify-content-center"
      :count="results.count"
    />
  </div>
</template>

<script>
import RecordSpinner from "../../RecordSpinner";
import SearchPagination from "./SearchPagination";
import { mapStores } from "pinia";
import { useSearchStore } from "../../../stores/search";

export default {
  components: { RecordSpinner, SearchPagination },
  props: {
    type: String,
    results: {
      type: Object,
      default() {
        return {
          hits: [],
          count: undefined,
        };
      },
    },
    linkPath: String,
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
    loading() {
      return this.searchStore.loading;
    },
    thereAreHits() {
      return this.results.hits && this.results.hits.length;
    },
    thereAreMoreHits() {
      const results = this.results;
      const hits = results.hits;
      return hits && hits.length && results.count > hits.length;
    },
    capitalizedType() {
      return this.type.charAt(0).toUpperCase() + this.type.slice(1);
    },
  },
};
</script>
