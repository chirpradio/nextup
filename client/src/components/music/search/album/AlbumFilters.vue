<template>
  <form id="filters" class="row pl-2" v-on:submit.prevent="search">
    <div class="col-lg-2">
      <label class="" for="search">Album/artist name</label>
      <input
        class="form-control w-100"
        id="search"
        type="search"
        v-model="query.term"
        aria-label="search"
      />
    </div>
    <div class="col-lg-2 mt-1">
      <label class="" for="label">Label</label>
      <input
        class="form-control w-100"
        id="label"
        type="search"
        v-model="query.album.label"
      />
    </div>
    <div class="col-lg-1 mt-1">
      <label class="" for="year">Year</label>
      <input
        class="form-control w-100"
        id="year"
        type="number"
        v-model="query.album.year"
      />
    </div>
    <div class="col-lg-1 mt-1">
      <label for="rotation">Rotation</label>
      <select id="rotation" class="form-select" v-model="query.album.rotation">
        <option value="any">Any</option>
        <option value="heavy_rotation">Heavy</option>
        <option value="light_rotation">Light</option>
      </select>
    </div>
    <div class="col-lg-2 mt-1">
      <label for="local">Local</label>
      <select id="local" class="form-select" v-model="query.album.local">
        <option value="any">Any</option>
        <option value="local_current">Current</option>
        <option value="local_classic">Classic</option>
      </select>
    </div>
    <div class="col-lg-1 mt-1 mr-2">
      <label for="is_compilation">Compilation</label>
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="is_compilation"
          v-model="query.album.is_compilation"
        />
        <label class="form-check-label"></label>
      </div>
    </div>
    <div class="col-lg-2 mt-1">
      <label class="w-100">&nbsp;</label>
      <div class="flex-row">
        <button class="btn btn-chirp-red" type="submit">Search</button>
        <router-link
          class="btn btn-link btn-link-chirp-red"
          :to="{ path: '/library/search/album', query: { index: 'album' } }"
        >
          clear filters
        </router-link>
      </div>
    </div>
  </form>
</template>

<script>
import queryMethods from "../../../../mixins/queryMethods";
import updateTitle from "../../../../mixins/updateTitle";
import { mapStores } from "pinia";
import { useSearchStore } from "../../../../stores/search";

export default {
  name: "AlbumFilters",
  computed: {
    ...mapStores(useSearchStore),
    query() {
      const base = {
        index: "album",
        album: {},
        offset: 0,
        limit: 50,
      };
      return Object.assign(base, this.$route.query);
    },
  },
  created() {
    this.dispatch();
    this.updateTitle("Album Search");
  },
  watch: {
    "$route.query": "dispatch",
  },
  mixins: [queryMethods, updateTitle],
  methods: {
    search: function () {
      /*
        Vue Router does not seem to do a deep comparison of query objects,
        so updates to the filters and the query.album object do not 
        successfully navigate. Passing a new, unused timestamp parameter
        with each push results in a successful navigation and a new search.
      */
      const now = new Date();
      this.$router.push({
        query: this.removeEmptyStrings(this.query),
        params: {
          timestamp: now.getTime(),
        },
      });
    },
    dispatch: async function () {
      await this.searchStore.search(this.query);
    },
  },
};
</script>
