<template>
  <div>
    <ArtistLink :artist="element.artist" class="fw-bold" />
  </div>
</template>

<script>
import ArtistLink from "@/components/music/ArtistLink.vue";

export default {
  name: "ArtistItem",
  components: { ArtistLink },
  props: {
    element: Object,
  },
};
</script>
