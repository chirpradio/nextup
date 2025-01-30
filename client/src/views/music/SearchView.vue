<template>
  <div>
    <div class="row">
      <div class="col-md-12 pb-2 mb-2 border-bottom bg-light">
        <nav class="nav nav-tabs mb-3 align-items-center bg-white">
          <h5 class="mb-0 mx-2">Searching</h5>
          <router-link
            class="nav-link mx-1"
            exact-active-class="active bg-light "
            :to="{
              path: '/library/search',
              query: { term: this.term },
            }"
          >
            Everything
          </router-link>
          <router-link
            class="nav-link mx-1"
            active-class="active bg-light "
            :to="{
              path: '/library/search/album',
              query: { term: this.term, index: 'album' },
            }"
          >
            Albums
          </router-link>
          <router-link
            class="nav-link mx-1"
            active-class="active bg-light "
            :to="{
              path: '/library/search/track',
              query: { term: this.term, index: 'track' },
            }"
          >
            Tracks
          </router-link>
        </nav>
        <router-view name="filters" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <router-view name="results" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchView",
  computed: {
    term() {
      return this.$route.query.term;
    },
  },
};
</script>

<style scoped>
nav {
  margin: 0 -1rem;
  padding: 0 1rem;
}

.nav-link.active {
  border-bottom: none;
}
</style>
