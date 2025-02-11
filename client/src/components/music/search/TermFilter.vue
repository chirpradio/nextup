<template>
  <form id="filters" class="row row-cols-lg-auto" @submit.prevent="search">
    <div class="flex-grow-1 mr-2 mb-3">
      <label class="d-none" for="search">Search</label>
      <input
        class="form-control"
        id="search"
        name="term"
        type="search"
        placeholder="search term"
        v-model="query.term"
        aria-label="search"
      />
    </div>
    <div class="col-auto">
      <button class="btn btn-chirp-red" type="submit">Search</button>
    </div>
  </form>
</template>

<script>
import formatters from "../../../mixins/formatters";
import updateTitle from "../../../mixins/updateTitle";
import { mapStores } from "pinia";
import { useSearchStore } from "../../../stores/search";

export default {
  name: "TermFilter",
  mixins: [formatters, updateTitle],
  props: {
    index: String,
  },
  computed: {
    ...mapStores(useSearchStore),
    query() {
      const base = {
        term: "",
        index: this.index,
        offset: 0,
        limit: 50,
      };
      return Object.assign(base, this.$route.query);
    },
  },
  created() {
    this.dispatch();
    this.updateTitle(`${this.capitalizeFirstLetter(this.index)} Search`);
  },
  watch: {
    "$route.query": "dispatch",
  },
  methods: {
    search: function () {
      this.$router.push({ query: this.query });
    },
    dispatch: async function () {
      await this.searchStore.search(this.query);
    },
  },
};
</script>
