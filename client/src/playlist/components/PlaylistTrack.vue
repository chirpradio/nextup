<template>
  <div class="row gx-2 border-bottom">
    <div class="col-2">
      <PlayedTime :date="track.established" />
    </div>
    <div class="col-10 ps-3 ps-md-0">
      <div class="d-flex flex-column flex-grow-1">
        <div class="mb-1 d-flex flex-row">
          <div class="flex-grow-1">
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
            <TagList :tags="track.categories" class="d-inline ms-2" />
          </div>
          <div v-if="!editable" class="col-1">
            <button
              class="btn btn-link-chirp-red btn-sm"
              aria-label="delete from playlist"
              title="delete from playlist"
              @click="showConfirmationModal"
            >
              <font-awesome-icon icon="xmark" />
            </button>
          </div>
        </div>
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

    <Modal
      ref="deleteModal"
      title="Delete track from playlist"
      @confirm="deleteTrack"
      confirmLabel="delete from playlist"
    >
      <p>
        Deleting the track will not update chirpradio.org or the mobile apps, but it will be removed from Music Department reporting.
      </p>
      <p class="text-danger">
        <span class="fw-bold">{{ artist }}</span> 
        <span> “{{ title }}” from</span>
        <span class="fst-italic">&nbsp;{{ album }}</span>
        <span> ({{ label }})</span>
      </p>
      
    </Modal>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { usePlaylistStore } from "../store";
import PlayedTime from "./PlayedTime.vue";
import TagList from "@/components/music/TagList.vue";
import Modal from "@/components/ModalDialog.vue";

export default {
  components: { PlayedTime, TagList, Modal },
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
    showConfirmationModal() {
      this.$refs.deleteModal.show();
    },
    async deleteTrack() {
      this.$refs.deleteModal.hide();
      await this.playlistStore.deletePlaylistEvent(this.track);
    },
  },
};
</script>
