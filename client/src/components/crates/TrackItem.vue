<template>
  <div>
    <div class="mb-1">
      <ArtistLink :artist="element.artist" class="fw-bold me-1" />
      <span class="me-1">&middot; “{{ element.track.title }}” &middot;</span>
      <AlbumTitleLink :album="element.album" class="fst-italic me-1" />
      <span v-if="element.album.label" class="me-1 text-muted"
        >&middot; {{ element.album.label }}</span
      >
      <span v-if="element.album.year" class="me-1 text-muted"
        >&middot; {{ element.album.year }}</span
      >
    </div>
    <TagList :tags="element.album.current_tags" />
  </div>
</template>

<script>
import ArtistLink from "../music/ArtistLink";
import AlbumTitleLink from "../music/AlbumTitleLink";
import TagList from "../music/TagList";

export default {
  name: "TrackItem",
  components: { AlbumTitleLink, ArtistLink, TagList, },
  props: {
    element: Object,
  },
};
</script>
