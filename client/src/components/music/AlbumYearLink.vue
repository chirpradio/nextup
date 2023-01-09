<template>
  <router-link
    class="text-break"
    :to="{
      path: '/library/search/album',
      query: {
        type: 'album',
        album: {
          year: albumYear,
        },
        offset: 0,
        limit: 50,
      },
    }"
    :title="albumYear"
  >
    {{ albumYear }}
  </router-link>
</template>

<script>
export default {
  name: "AlbumYearLink",
  props: {
    albumYear: String,
  },
};
</script>
