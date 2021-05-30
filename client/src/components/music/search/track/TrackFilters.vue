<template>
  <div>
    <button class="btn btn-link-chirp-red p-0 mb-3" @click="toggleFilters">
      {{ toggleLabel }}
    </button>
    <form v-if="filtersOpen" class="col-sm-8" @submit.prevent="search">
      <div class="mb-3">
        <label for="search">Search term</label>
        <div class="col-sm-6">
          <input
            class="form-control"
            id="search"
            type="search"
            v-model="query.term"
            aria-label="search"
          />
        </div>
      </div>
      <fieldset class="row mb-4">
        <legend>Track</legend>
        <div class="col-12 col-md-2 mb-3">
          <label class="">Min. length</label>
          <select
            id="track__duration_ms_gte_input"
            class="form-select form-select-sm"
            v-model="query.track.duration_ms.gte"
          >
            <option value="0">0:00</option>
            <option value="30000">0:30</option>
            <option value="60000">1:00</option>
            <option value="90000">1:30</option>
            <option value="120000">2:00</option>
            <option value="150000">2:30</option>
            <option value="180000">3:00</option>
            <option value="210000">3:30</option>
            <option value="240000">4:00</option>
            <option value="270000">4:30</option>
            <option value="300000">5:00</option>
            <option value="360000">6:00</option>
            <option value="420000">7:00</option>
            <option value="480000">8:00</option>
            <option value="540000">9:00</option>
            <option value="600000">10:00</option>
          </select>
        </div>
        <div class="col-12 col-md-2 mb-3">
          <label>Max length</label>
          <select
            id="track__duration_ms_lte_input"
            class="form-select form-select-sm"
            v-model="query.track.duration_ms.lte"
          >
            <option value="">Any</option>
            <option value="30000">0:30</option>
            <option value="60000">1:00</option>
            <option value="90000">1:30</option>
            <option value="120000">2:00</option>
            <option value="150000">2:30</option>
            <option value="180000">3:00</option>
            <option value="210000">3:30</option>
            <option value="240000">4:00</option>
            <option value="270000">4:30</option>
            <option value="300000">5:00</option>
            <option value="360000">6:00</option>
            <option value="420000">7:00</option>
            <option value="480000">8:00</option>
            <option value="540000">9:00</option>
            <option value="600000">10:00</option>
          </select>
        </div>
        <div class="col-12 col-md-3">
          <label class="form-check-label" for="is_recommended">
            Recommended ⭐
          </label>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="is_compilation"
              v-model="query.track.is_recommended"
            />
            <label class="form-check-label"></label>
          </div>
        </div>
      </fieldset>
      <fieldset class="row mb-4">
        <legend>Album</legend>
        <div class="col-12 col-md-2 mb-3">
          <label class="" for="label">Label</label>
          <input
            class="form-control form-control-sm"
            id="label"
            type="search"
            v-model="query.album.label"
          />
        </div>
        <div class="col-12 col-md-2 mb-3">
          <label class="" for="year">Year</label>
          <input
            class="form-control form-control-sm"
            id="year"
            type="number"
            v-model="query.album.year"
          />
        </div>
        <div class="col-12 col-md-2 mb-3">
          <label class="" for="rotation">Rotation</label>
          <select
            id="rotation"
            class="form-select form-select-sm"
            v-model="query.album.rotation"
          >
            <option value="any">Any</option>
            <option value="heavy_rotation">Heavy</option>
            <option value="light_rotation">Light</option>
          </select>
        </div>
        <div class="col-12 col-md-2 mb-3">
          <label class="" for="local">Local</label>
          <select
            id="local"
            class="form-select form-select-sm"
            v-model="query.album.local"
          >
            <option value="any">Any</option>
            <option value="local_current">Current</option>
            <option value="local_classic">Classic</option>
          </select>
        </div>
        <div class="col-12 col-md-2 mb-3">
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
      </fieldset>
      <div>
        <button class="col-4 btn btn-chirp-red" type="submit">Search</button>
        <router-link
          class="btn btn-link btn-link-chirp-red"
          :to="{ path: '/library/search/track', query: { type: 'track' } }"
        >
          clear filters
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import queryMethods from "../../../../mixins/queryMethods";

export default {
  name: "TrackFilters",
  data() {
    return {
      filtersOpen: true,
    };
  },
  computed: {
    query() {
      return {
        type: "track",
        offset: 0,
        limit: 50,
        ...this.$route.query,
        album: {
          ...this.$route.query.album,
        },
        track: {
          duration_ms: {},
          ...this.$route.query.track,
        },
      };
    },
    toggleLabel() {
      return this.filtersOpen ? "▾ close filters" : "▸ open filters";
    },
  },
  created() {
    this.dispatch();
  },
  watch: {
    "$route.query": "dispatch",
  },
  mixins: [queryMethods],
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
      this.toggleFilters();
    },
    dispatch: async function () {
      await this.$store.dispatch("search", this.query);
    },
    toggleFilters: function () {
      this.filtersOpen = !this.filtersOpen;
    },
  },
};
</script>
