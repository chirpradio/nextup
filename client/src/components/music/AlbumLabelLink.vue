<template>
  <router-link
    class="text-break"
    :to="{
      path: '/library/search/album',
      query: {
        type: 'album',
        album: {
          label: albumLabel,
        },
        offset: 0,
        limit: 50,
      },
    }"
    :title="albumLabel"
  >
    {{ albumLabel }}
  </router-link>
</template>

<script>
export default {
  name: "AlbumLabelLink",
  props: {
    albumLabel: String,
  },
};
</script>
