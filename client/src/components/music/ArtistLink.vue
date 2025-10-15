<template>
  <router-link
    v-if="artistId"
    class="text-break"
    :to="{ name: 'artist', params: { id: artistId } }"
  >
    {{ artist.name }}
  </router-link>
</template>

<script>
export default {
  name: "ArtistLink",
  props: {
    artist: Object,
  },
  computed: {
    /*
      some artists are stored with a simple numeric id,
      while others are stored with an alphanumeric hash that begins with
      "artist:" *and* have a parent id that needs to be included in the query
    */
    artistId: function () {
      const key = this.artist?.__key;
      if (!key) {
        return undefined;
      }
      return key.id || `${key.name}-${key.parent.id}`;
    },
  },
};
</script>
