<template>
  <div>
    <div class="mb-1">
      <span v-if="element.artist" class="fw-bold me-1">{{
        element.artist.name
      }}</span>
      <span v-if="element.artist && element.track" class="me-1">&middot;</span>
      <span v-if="element.track" class="me-1"
        >“{{ element.track.title }}”</span
      >
      <span v-if="element.track && element.album" class="me-1">&middot;</span>
      <span v-if="element.album" class="me-1 fst-italic"
        >{{ element.album.title }}</span
      >
      <span v-if="element.album && element.album.label" class="me-1">&middot;</span>
      <span v-if="element.album && element.album.label" class="me-1"
        >{{ element.album.label }}</span
      >
    </div>
    <div class="text-muted">{{ element.notes }}</div>
  </div>
</template>

<script>
export default {
  name: "CrateItem",
  props: {
    element: Object,
  },
};
</script>
