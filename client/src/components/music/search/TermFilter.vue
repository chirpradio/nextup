<template>
  <form id="filters" class="row row-cols-lg-auto" @submit.prevent="search">
    <div class="flex-grow-1 mr-2 mb-3">
      <label class="visually-hidden" for="search">Search</label>
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

export default {
  name: "TermFilter",
  mixins: [formatters, updateTitle],
  props: {
    type: String,
  },
  computed: {
    query() {
      const base = {
        term: "",
        type: this.type,
        offset: 0,
        limit: 50,
      };
      return Object.assign(base, this.$route.query);
    },
  },
  created() {
    this.dispatch();
    this.updateTitle(`${this.capitalizeFirstLetter(this.type)} Search`);
  },
  watch: {
    "$route.query": "dispatch",
  },
  methods: {
    search: function () {
      this.$router.push({ query: this.query });
    },
    dispatch: async function () {
      await this.$store.dispatch("search", this.query);
    },
  },
};
</script>
