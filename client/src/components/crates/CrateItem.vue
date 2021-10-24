<template>
  <div>
    <div class="mb-1">
      <span v-if="element.artist" class="fw-bold me-2">{{
        element.artist.name
      }}</span>
      <span v-if="element.track" class="me-1">“{{ element.track.title }}”</span>
      <span v-if="element.track && element.album" class="me-1">from</span>
      <span v-if="element.album" class="me-1 fst-italic">{{
        element.album.title
      }}</span>
      <span v-if="element.album && element.album.label" class="me-1 text-muted"
        >({{ element.album.label }})</span
      >
    </div>
    <TagList class="mb-1" :tags="element.categories" />
    <div class="text-muted">{{ element.notes }}</div>
  </div>
</template>

<script>
import TagList from "../music/TagList";

export default {
  name: "CrateItem",
  components: { TagList },
  props: {
    element: Object,
  },
};
</script>
