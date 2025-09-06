<template>
  <div>
    <ol class="list-group list-group-unstyled list-group-flush mb-5 mb-lg-3">
      <li
        v-for="track in album.tracks"
        :key="track.id"
        class="list-group-item d-flex flex-column flex-md-row align-items-start px-1 bg-transparent"
        :class="listItemClasses(track)"
      >
        <div class="d-flex flex-fill flex-column flex-md-row">
          <div class="d-flex">
            <span class="track-number text-left text-md-center"
              >{{ track.track_num }}.</span
            >
            <TrackTag
              v-if="!editing"
              :track="track"
              class="mt-1 mt-md-2 mt-xl-1 ms-lg-1"
            />
            <TrackTagEditor
              v-if="editing"
              :track="track"
              :album_id="album.album_id"
              class="ms-lg-1"
            />
          </div>
          <div
            class="d-flex flex-column flex-lg-row flex-fill ms-0 ms-md-2 mt-2 mt-md-0"
          >
            <div class="me-auto mb-2 mb-lg-0">
              <div class="mb-1 me-2">
                <span>{{ track.title }}</span>
                <span v-if="album.is_compilation">
                  by
                  <ArtistLink :artist="track.track_artist" />
                </span>
              </div>
              <div
                v-if="track.pronunciation"
                class="text-muted fw-light fst-italic"
              >
                {{ track.pronunciation }}
              </div>
              <div class="mb-1">
                <TrackDuration :track="track" />
                <small class="text-muted fw-light">
                  &middot; {{ track.bit_rate_kbps }}kbps
                </small>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex mb-2 mb-md-0">
          <PlayButton
            :album="album"
            :categories="album.current_tags"
            :track="track"
            class="mt-0 mb-0 me-2"
          />
          <AddToCrate
            :keyToAdd="track.__key"
            :limitWidth="true"
            class="mt-lg-0"
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
}
</style>

<script>
import AddToCrate from "../AddToCrate.vue";
import ArtistLink from "./ArtistLink.vue";
import PlayButton from "./PlayButton.vue";
import TrackDuration from "./TrackDuration.vue";
import TrackTag from "./TrackTag.vue";
import TrackTagEditor from "./TrackTagEditor.vue";
import trackMixins from "@/mixins/track";

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
