<template>
  <div>
    <form id="search" class="col-md-12 border p-3 mb-3 form-inline" v-on:submit.prevent="search">
      <div class="form-group flex-grow-1 pr-3">
        <label class="sr-only" for="search">Search</label>
        <input class="form-control flex-grow-1" id="search" v-model="term" name="term" type="search" placeholder="search the entire music library by album, track, or artist name (or words in a review)" aria-label="search">
      </div>
      <button class="btn btn-chirp-red" type="submit">Search</button>
      <span class="mx-2">or</span>
      <router-link to="/library/search" class="btn btn-outline-dark">Randomize</router-link>
    </form>

    <AlbumCollection 
      heading="Heavy Rotation" 
      :albums="$store.getters.taggedAlbums('heavy_rotation')" 
      :loading="$store.getters.loadingTaggedAlbums('heavy_rotation')"
      :limit="4" 
      tag="heavy_rotation"
      sortBy="shuffle"
      :seeAllLink="{ name: 'tag', params: { tag: 'heavy_rotation' }}" />
    <AlbumCollection 
      heading="Light Rotation" 
      :albums="$store.getters.taggedAlbums('light_rotation')" 
      :loading="$store.getters.loadingTaggedAlbums('light_rotation')"
      :limit="4" 
      tag="light_rotation"
      sortBy="shuffle"
      :seeAllLink="{ name: 'tag', params: { tag: 'light_rotation' }}" />
    <AlbumCollection 
      heading="Library Adds" 
      :albums="$store.getters.libraryAdds" 
      :loading="$store.getters.loadingRecentAlbums"
      :limit="4" 
      sortBy="shuffle"
      :seeAllLink="{ name: 'LibraryAdds' }" />
  </div>
</template>

<script>
import AlbumCollection from "../../components/music/AlbumCollection"

export default {
  name: "MusicHome",
  title: "Music",
  components: {
    AlbumCollection,
  },
  props: {
    term: String,
  },
  mounted () {
    this.$store.dispatch('getTaggedAlbums', "heavy_rotation");
    this.$store.dispatch('getTaggedAlbums', "light_rotation");
    this.$store.dispatch('getRecentAlbums');
  },
  methods: {
    search () {
      this.$router.push({ name: "SearchEverything", query: { 'term' : this.term } });
    },
  }
}
</script>