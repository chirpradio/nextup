<template>
  <div class="d-flex flex-column flex-md-row">
    <div class="d-flex flex-column flex-grow-1">
      <ArtistLink :artist="element.artist" class="fw-bold" />
    </div>
    <PlayButton :artist="element.artist" type="freeform" class="mt-2 mt-md-0" />
  </div>
</template>

<script>
import ArtistLink from "@/components/music/ArtistLink.vue";
import PlayButton from "../music/PlayButton.vue";

export default {
  name: "ArtistItem",
  components: { ArtistLink, PlayButton },
  props: {
    element: Object,
  },
};
</script>
