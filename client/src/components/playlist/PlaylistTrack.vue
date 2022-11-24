<template>
  <div class="row g-2 border-bottom">
    <div class="col-2">
      <PlayedTime :date="track.established" />
    </div>
    <div class="col-10">
      <div class="d-flex flex-column flex-grow-1">
        <div>
          <span class="fw-bold">{{ artist }}</span> “{{ title }}” from 
          <button
            v-if="!freeform"
            class="btn btn-link-chirp-red fst-italic px-1 py-0 border-0 align-baseline"
            data-bs-toggle="offcanvas"
            data-bs-target="#albumPreview"
            role="button"
            aria-controls="albumPreview"
            @click="emitSelected"
          >
            <font-awesome-icon icon="square-caret-left" />
            {{ album }}
          </button>
          <span class="text-muted"> ({{ label }})</span>
        </div>
        <TagList :tags="track.categories" class="mb-1" />
        <div class="text-muted">{{ track.notes }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayedTime from "./PlayedTime.vue";
import TagList from "../music/TagList.vue";

const SELECTED = "selected";

export default {
  components: { PlayedTime, TagList },
  props: {
    track: Object,
  },
  computed: {
    artist() {
      return this.track.freeform_artist_name || this.track.artist.name;
    },
    title() {
      return this.track.freeform_track_title || this.track.track.title;
    },
    album() {
      return this.track.freeform_album_title || this.track.album.title;
    },
    label() {
      return this.track.freeform_label || this.track.album.label;
    },
    freeform() {
      return this.track.freeform_track_title;
    },  
  },
  emits: [SELECTED],
  methods: {
    emitSelected() {
      this.$emit(SELECTED, { album_id: this.track.album.album_id});
    }
  }
};
</script>
