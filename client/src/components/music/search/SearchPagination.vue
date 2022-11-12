<template>
  <nav aria-label="Search result pagination">
    <div class="d-inline align-middle">
      <button
        class="btn btn-link btn-link-chirp-red"
        :disabled="onFirstPage"
        @click="previous()"
      >
        &laquo;
      </button>
      <input
        class="page-number text-right"
        type="number"
        min="1"
        :max="totalPages"
        :value="currentPage"
        @keyup.enter="changePage"
        :disabled="onlyOnePage"
      />
      <span>&nbsp;of {{ totalPages }}</span>
      <button
        class="btn btn-link btn-link-chirp-red"
        :disabled="onLastPage"
        @click="next()"
      >
        &raquo;
      </button>
    </div>
  </nav>
</template>

<style scoped>
input.page-number {
  width: 4rem;
}
</style>

<script>
import { mapStores } from 'pinia';
import { useSearchStore } from '../../../stores/search';

export default {
  name: "SearchPagination",
  props: {
    count: Number,
  },
  computed: {
    ...mapStores(useSearchStore),
    offset() {
      const value = parseInt(this.$route.query.offset, 10);
      return Number.isNaN(value) ? 0 : value;
    },
    limit() {
      const value = parseInt(this.$route.query.limit, 10);
      return Number.isNaN(value) ? 50 : value;
    },
    currentPage() {
      return Math.floor(this.offset / this.limit) + 1;
    },
    totalPages() {
      return Math.ceil(this.count / this.limit);
    },
    onFirstPage() {
      return this.currentPage === 1;
    },
    onLastPage() {
      return this.currentPage === this.totalPages;
    },
    onlyOnePage() {
      return this.totalPages === 1;
    },
  },
  methods: {
    previous() {
      this.go(this.offset - this.limit);
    },
    next() {
      this.go(this.offset + this.limit);
    },
    changePage(event) {
      let newPage;
      newPage = Math.min(event.target.value, this.totalPages);
      newPage = Math.max(newPage, 1);
      this.go((newPage - 1) * this.limit);
    },
    async go(newOffset) {
      this.searchStore.setOffset(newOffset);
      const now = new Date();
      this.$router.push({
        query: this.searchStore.query,
        params: { timestamp: now.getTime() },
      });
    },
  },
};
</script>
