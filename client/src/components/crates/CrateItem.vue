<template>
  <div class="d-flex flex-column flex-md-row">
    <div class="d-flex flex-column flex-grow-1">
      <div class="mb-1">
        <span v-if="element.artist" class="fw-bold me-2">{{
          element.artist.name
        }}</span>
        <span v-if="element.track" class="me-1"
          >“{{ element.track.title }}”</span
        >
        <span v-if="element.track && element.album" class="me-1">from</span>
        <span v-if="element.album" class="me-1 fst-italic">{{
          element.album.title
        }}</span>
        <span
          v-if="element.album && element.album.label"
          class="me-1 text-muted"
          >({{ element.album.label }})</span
        >
      </div>
      <TagList class="mb-1" :tags="element.categories" />
      <div class="text-muted">{{ element.notes }}</div>
    </div>
    <PlayButton
      v-if="hasTitle"
      type="freeform"
      :album="element.album"
      :artist="element.artist"
      :categories="element.categories"
      :notes="element.notes"
      :track="element.track"
      class="mt-2 mt-md-0"
    />
  </div>
</template>

<script>
import TagList from "../music/TagList";
import PlayButton from "../music/PlayButton";

export default {
  name: "CrateItem",
  components: { TagList, PlayButton },
  props: {
    element: Object,
  },
  computed: {
    hasTitle() {
      return this.element.track?.title.length > 0;
    },
  },
};
</script>
