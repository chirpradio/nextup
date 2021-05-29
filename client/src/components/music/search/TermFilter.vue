<template>
  <form id="filters" class="form-inline" v-on:submit.prevent="search"> 
    <div class="form-group flex-fill mr-2">
      <label class="sr-only" for="search">Search</label>
      <input class="form-control w-100" id="search" name="term" type="search" placeholder="search term" v-model="query.term" aria-label="search">
    </div>
    <div class="form-group mr-2">
      <button class="btn btn-chirp-red" type="submit">Search</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "TermFilter",
  props: {
    type: String,
  },
  computed: {
    query () {
      const base = {
        term: "",
        type: this.type,
        offset: 0,
        limit: 50,
      };
      return Object.assign(base, this.$route.query);      
    }
  },
  created () {
    this.dispatch();
  },
  watch: {
    '$route.query': "dispatch",
  },
  methods: {
    search: function () {
      this.$router.push({ query: this.query });
    },
    dispatch: async function () {
      await this.$store.dispatch('search', this.query);      
    }
  }
}
</script>