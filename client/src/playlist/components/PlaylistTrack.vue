<template>
  <div class="row gx-2 border-bottom">
    <div class="col-2">
      <PlayedTime :date="track.established" />
    </div>
    <div class="col-10 ps-3 ps-md-0">
      <div class="d-flex flex-column flex-grow-1">
        <div>
          <span class="fw-bold">{{ artist }}</span> “{{ title }}” from
          <span class="fst-italic" v-if="freeform">{{ album }}</span>
          <button
            v-if="!freeform"
            class="btn btn-link-chirp-red fst-italic px-1 py-0 border-0 align-baseline"
            data-bs-toggle="offcanvas"
            data-bs-target="#albumPreview"
            role="button"
            aria-controls="albumPreview"
            @click="selectAlbum"
          >
            <font-awesome-icon icon="square-caret-left" />
            {{ album }}
          </button>
          <span class="text-muted"> ({{ label }})</span>
        </div>
        <TagList :tags="track.categories" class="mb-2" />
        <div v-if="editable" class="form-floating mb-2">
          <input
            class="form-control"
            id="notes"
            :value="notes"
            @input="$emit('update:notes', $event.target.value)"
          />
          <label class="form-label" for="notes">Notes</label>
        </div>
        <div v-if="!editable && track.notes" class="text-muted">
          {{ track.notes }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { usePlaylistStore } from "../store";
import PlayedTime from "./PlayedTime.vue";
import TagList from "@/components/music/TagList.vue";

export default {
  components: { PlayedTime, TagList },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    notes: String,
    track: Object,
  },
  computed: {
    ...mapStores(usePlaylistStore),
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
      return !this.track.album?.album_id;
    },
  },
  methods: {
    selectAlbum() {
      this.playlistStore.selectAlbum(this.track.album.album_id.value);
    },
  },
};
</script>
