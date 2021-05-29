<template>
  <div class="album-collection pb-3">
    <h1 v-if="heading">{{heading}} <router-link v-if="seeAllLink" :to="seeAllLink"><small>see all</small></router-link></h1> 
    <div class="row px-2">
      <AlbumCard v-for="album in sortedAlbums" :key="album.album_id" :album="album" :hideArtistLink="hideArtistLinks" />
      <button v-if="more && !loading" type="button" class="btn btn-chirp-red mt-2" @click="getMore">show more albums</button>
      <RecordSpinner v-if="loading" />
    </div>
  </div>
</template>

<style>
  .album-collection {
    min-height: 30rem;
  }
</style>

<script>
import AlbumCard from "./AlbumCard";
import RecordSpinner from "../RecordSpinner";

function shuffle(array) {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function compare(prop, a, b) {
  if ( a[prop] < b[prop] ){
    return 1;
  }
  if ( a[prop] > b[prop] ){
    return -1;
  }
  return 0;
}

function compareByProperty(prop) {
  return (a, b) => {
    return compare(prop, a, b)
  }
}

export default {
  components: {
    AlbumCard,
    RecordSpinner,
  },
  props: {
    albums: Array,
    heading: String,
    hideArtistLinks: Boolean,
    loading: Boolean,
    limit: Number,
    more: Boolean,
    sortBy: [String, Array],
    seeAllLink: Object,    
  },
  computed: {
    sortedAlbums () {
      if(!this.sortBy && !this.limit) {
        return this.albums;
      }

      let sorted;
      if(this.sortBy && this.sortBy === "shuffle") {
        sorted = shuffle(this.albums);
      } 
      else if (this.sortBy && typeof this.sortBy === "string") {
        this.albums.sort(compareByProperty(this.sortBy));
        sorted = this.albums;
      } else {
        sorted = this.albums;
      }

      if(this.limit) {
        return sorted.slice(0, this.limit);
      } else {
        return sorted;
      }  
    }
  },
  methods: {
    getMore() {      
      this.$emit('more');
    } 
  }
}
</script>