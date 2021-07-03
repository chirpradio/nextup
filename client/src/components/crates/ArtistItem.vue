<template>
  <div>
    <ArtistLink :artist="element.artist" class="fw-bold" />
  </div>
</template>

<script>
import ArtistLink from "../music/ArtistLink";

export default {
  name: "ArtistItem",
  components: { ArtistLink },
  props: {
    element: Object,
  },
};
</script>
