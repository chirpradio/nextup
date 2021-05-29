<template>
  <form id="filters" class="form-inline" v-on:submit.prevent="search"> 
    <div class="form-group flex-fill mr-2">
      <label class="sr-only" for="search">Search</label>
      <input class="form-control w-100" id="search" name="term" type="search" placeholder="search by album, track, or artist name (or words in a review)" v-model="term" aria-label="search">
    </div>
    <div class="form-group mr-2">
      <button class="btn btn-chirp-red" type="submit">Search Everything</button>
    </div>
    <div class="form-group">      
      <div class="dropdown">
        <button class="btn btn-link-chirp-red dropdown-toggle" type="button" id="searchByTypeButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Search by Type
        </button>
        <div class="dropdown-menu" aria-labelledby="searchByType">
          <router-link class="dropdown-item" :to="{ path: '/library/search/album', query: { term: this.term, type: 'album' } }">Album</router-link>
          <a class="dropdown-item" href="/library/search/track">Track</a>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: "EverythingFilters",
  data () {
    return {
      term: this.$route.query.term,
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
      this.$router.push({query: { 'term' : this.term }});
    },
    dispatch: async function () {
      await this.$store.dispatch('search', this.$route.query);      
    }
  }
}
</script>