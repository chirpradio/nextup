<template>
  <div>
    <div class="mb-1">
      <ArtistLink :artist="element.artist" class="fw-bold me-2" />
      <span class="me-1">“{{ element.track.title }}” from</span>
      <CrateAlbumSpans :album="element.album" />
    </div>
    <TagList :tags="element.album.current_tags" />
  </div>
</template>

<script>
import ArtistLink from "../music/ArtistLink";
import CrateAlbumSpans from "./CrateAlbumSpans";
import TagList from "../music/TagList";

export default {
  name: "TrackItem",
  components: { ArtistLink, CrateAlbumSpans, TagList },
  props: {
    element: Object,
  },
};
</script>
