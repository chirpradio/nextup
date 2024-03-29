<template>
  <div>
    <ol class="list-group list-group-unstyled list-group-flush mb-5 mb-lg-3">
      <li
        v-for="track in album.tracks"
        :key="track.id"
        class="list-group-item d-flex align-items-start px-1 bg-transparent"
        :class="listItemClasses(track)"
      >
        <div class="d-flex flex-column flex-xl-row">
          <span class="track-number">{{ track.track_num }}.</span>
          <TrackTag
            v-if="!editing"
            :track="track"
            class="mt-2 mt-xl-1 ms-lg-1"
          />
          <TrackTagEditor
            v-if="editing"
            :track="track"
            :album_id="album.album_id"
            class="ms-lg-1"
          />
        </div>
        <div class="d-flex flex-fill flex-column flex-lg-row ms-2">
          <div class="me-auto mb-2 mb-lg-0">
            <div class="mb-1 me-2">
              <span>{{ track.title }}</span>
              <span v-if="album.is_compilation">
                by
                <ArtistLink :artist="track.track_artist" />
              </span>
            </div>
            <div class="col mb-1">
              <TrackDuration :track="track" />
              <small class="text-muted fw-light">
                &middot; {{ track.bit_rate_kbps }}kbps
              </small>
            </div>
          </div>
          <AddToCrate
            :keyToAdd="track.__key"
            :limitWidth="true"
            class="mt-lg-0 col col-lg-3"
          />
          <PlayButton
            :album="album"
            :categories="album.current_tags"
            :track="track"
            class="mt-2 mb-2 mt-lg-0 mb-lg-0 col-11 col-lg-auto"
          />
        </div>
      </li>
    </ol>
    <button
      v-if="!editing"
      class="btn btn-sm btn-outline-chirp-red"
      @click="startEditing"
    >
      edit tags
    </button>
    <button
      v-if="editing"
      class="btn btn-sm btn-outline-chirp-red"
      @click="finishEditing"
    >
      done editing
    </button>
  </div>
</template>

<style scoped>
.track-number {
  min-width: 1.36em;
  text-align: center;
}
</style>

<script>
import TrackTag from "./TrackTag.vue";
import AddToCrate from "../AddToCrate.vue";
import PlayButton from "./PlayButton.vue";
import TrackDuration from "./TrackDuration.vue";
import ArtistLink from "./ArtistLink.vue";
import trackMixins from "@/mixins/track";
import TrackTagEditor from "./TrackTagEditor.vue";

export default {
  components: {
    AddToCrate,
    ArtistLink,
    PlayButton,
    TrackDuration,
    TrackTag,
    TrackTagEditor,
  },
  props: {
    album: Object,
  },
  data() {
    return {
      editing: false,
    };
  },
  mixins: [trackMixins],
  methods: {
    listItemClasses(track) {
      return {
        "fw-bold": this.isRecommended(track),
        "text-muted": this.isExplicit(track),
      };
    },
    startEditing() {
      this.editing = true;
    },
    finishEditing() {
      this.editing = false;
    },
  },
};
</script>
