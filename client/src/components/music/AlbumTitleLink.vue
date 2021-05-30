<template>
  <router-link
    :to="{ name: 'album', params: { id: album.album_id.value } }"
    :title="albumTitle"
  >
    {{ albumTitle }}
  </router-link>
</template>

<script>
export default {
  name: "AlbumTitleLink",
  props: {
    album: Object,
  },
  computed: {
    albumTitle() {
      let title = this.album.title;

      if (this.album.disc_number) {
        title += ` (Disc ${this.album.disc_number})`;
      }

      return title;
    },
  },
};
</script>
