<template>
  <div>
    <div class="mb-1">
      <ArtistLink :artist="element.artist" class="fw-bold me-1" />
      <span class="me-1">&middot; “{{ element.track.title }}” &middot;</span>
      <AlbumTitleLink :album="element.album" class="fst-italic me-1" />
      <span v-if="element.album.label" class="me-1"
        >&middot; {{ element.album.label }}</span
      >
      <span v-if="element.album.year" class="me-1"
        >&middot; {{ element.album.year }}</span
      >
    </div>
  </div>
</template>

<script>
import ArtistLink from "../music/ArtistLink";
import AlbumTitleLink from "../music/AlbumTitleLink";

export default {
  name: "TrackItem",
  components: { AlbumTitleLink, ArtistLink },
  props: {
    element: Object,
  },
};
</script>
