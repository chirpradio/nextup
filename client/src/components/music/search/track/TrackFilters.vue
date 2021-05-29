<template>
  <form id="filters" class="form-inline form-row pl-2" @submit.prevent="search"> 
    <div class="form-group col-lg-2">
      <label class="" for="search">Track/album/artist name</label>
      <input class="form-control w-100" id="search" type="search" v-model="query.term" aria-label="search">
    </div>
    <div class="form-group col-lg-1 mt-1">
      <label for="track__duration_ms_gte_input">
        Min. Length
      </label>
      <select id="track__duration_ms_gte_input" class="form-control w-100" v-model="query.track.duration_ms.gte">
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
    <div class="form-group col-lg-1 mt-1">
      <label for="track__duration_ms_lte_input">
        Max. Length
      </label>
      <select id="track__duration_ms_lte_input" class="form-control w-100" v-model="query.track.duration_ms.lte">
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
    <div class="form-group col-lg-2 mt-1">    
      <label class="w-100">&nbsp;</label>
      <label class="badge badge-light ml-1 py-0" for="is_recommended">  
        <input class="form-control mr-1" id="is_recommended" type="checkbox" value="true" v-model="query.track.is_recommended">       
        Recommended ⭐️
      </label> 
    </div>
    <div class="form-group col-lg-2 mt-1">
      <label class="" for="label">Label</label>
      <input class="form-control w-100" id="label" type="search" v-model="query.album.label">
    </div>
    <div class="form-group col-lg-1 mt-1">
      <label class="" for="year">Year</label>
      <input class="form-control w-100" id="year" type="number" v-model="query.album.year">
    </div>
    <div class="form-group col-lg-1 mt-1">
      <label for="rotation">Rotation</label>
      <select id="rotation" class="form-control w-100" v-model="query.album.rotation">
        <option value="any">Any</option>
        <option value="heavy_rotation">Heavy</option>
        <option value="light_rotation">Light</option>
      </select>
    </div>
    <div class="form-group col-lg-1 mt-1">
      <label for="local">Local</label>
      <select id="local" class="form-control w-100" v-model="query.album.local">
        <option value="any">Any</option>
        <option value="local_current">Current</option>
        <option value="local_classic">Classic</option>
      </select>
    </div>
    <div class="form-group col-lg-1 mt-1 mr-1">    
      <label class="w-100">&nbsp;</label>
      <label class="badge badge-info ml-1 py-0" for="is_compilation">  
        <input class="form-control mr-1" id="is_compilation" type="checkbox" v-model="query.album.is_compilation">       
        Compilation        
      </label> 
    </div>
    <div class="form-group col-xl-2 mt-1">
      <label class="w-100">&nbsp;</label>
      <div class="flex-row">
        <button class="btn btn-chirp-red" type="submit">Search</button>
        <router-link class="btn btn-link btn-link-chirp-red" :to="{ path: '/library/search/track', query: { type: 'track' } }">clear filters</router-link>
      </div>
    </div>
  </form>
</template>

<script>
import queryMethods from "../../../../mixins/queryMethods";

export default {
  name: "TrackFilters",
  computed: {
    query () {
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
  },
  created () {
    this.dispatch();
  },
  watch: {
    '$route.query': "dispatch",
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
          timestamp: now.getTime() 
        }, 
      });    
    },
    dispatch: async function () {  
      await this.$store.dispatch('search', this.query);      
    }
  }
}
</script>