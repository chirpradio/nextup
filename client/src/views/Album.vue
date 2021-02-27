<template>
  <div>
    <p v-if="loading">
      Loading...
    </p>
    <article v-if="album">
      <h1>{{ album.title }}</h1>
      <add-to-crate :keyToAdd="album.key"></add-to-crate>
    </article>
  </div>
</template>

<script>
// import authService from "../services/auth.service";
import AddToCrate from '../components/AddToCrate.vue';

export default {
  components: { AddToCrate },
  data () {
    return {
      album: null, 
      error: null,     
      loading: false,
    }
  },
  created () {
    this.fetchAlbum();
  },
  watch: {
    '$route': 'fetchAlbum'
  },
  methods: {
    async fetchAlbum () {
      this.error = this.album = null;
      this.loading = true;
      try {
        const response = await fetch(`http://localhost:1071/api/album/${this.$route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        });
        this.album = await response.json();
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
    }
  }  
}
</script>