<template>
  <form ref="form">
    <div class="row mb-3">
      <label for="artist" class="col-2 col-form-label">Artist</label>
      <div class="col-10">
        <ArtistTypeahead v-model="item.artist" :required="required" />
        <div v-if="required" class="form-text">required</div>
      </div>
    </div>
    <div class="row mb-3">
      <label for="track" class="col-2 col-form-label">Track</label>
      <div class="col-10">
        <input
          id="track"
          class="form-control"
          v-model="item.track"
          :required="required"
          @change="onChange"
        />
        <div v-if="required" class="form-text">required</div>
      </div>
    </div>
    <div class="row mb-3">
      <label for="album" class="col-2 col-form-label">Album</label>
      <div class="col-10">
        <input
          id="album"
          class="form-control"
          v-model="item.album"
          :required="required"
          @change="onChange"
        />
        <div v-if="required" class="form-text">required</div>
      </div>
    </div>
    <div class="row mb-3">
      <label for="label" class="col-2 col-form-label">Label</label>
      <div class="col-10">
        <input
          id="label"
          class="form-control"
          v-model="item.label"
          :required="required"
          @change="onChange"
        />
        <div v-if="required" class="form-text">required</div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-2 col-form-label">Category</label>
      <div class="col-10">
        <div class="form-check">
          <input
            id="heavyRotation"
            class="form-check-input"
            type="checkbox"
            v-model="item.categories"
            value="heavy_rotation"
          />
          <label class="form-check-label" for="heavyRotation">
            Heavy Rotation
          </label>
        </div>
        <div class="form-check">
          <input
            id="lightRotation"
            class="form-check-input"
            type="checkbox"
            v-model="item.categories"
            value="light_rotation"
          />
          <label class="form-check-label" for="lightRotation">
            Light Rotation
          </label>
        </div>
        <div class="form-check">
          <input
            id="localClassic"
            class="form-check-input"
            type="checkbox"
            v-model="item.categories"
            value="local_classic"
          />
          <label class="form-check-label" for="localClassic">
            Local Classic
          </label>
        </div>
        <div class="form-check">
          <input
            id="localCurrent"
            class="form-check-input"
            type="checkbox"
            v-model="item.categories"
            value="local_current"
          />
          <label class="form-check-label" for="localCurrent">
            Local Current
          </label>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label for="notes" class="col-2 col-form-label">Notes</label>
      <div class="col-10">
        <input id="notes" class="form-control" v-model="item.notes" />
      </div>
    </div>
  </form>
</template>

<script>
import ArtistTypeahead from "./music/search/artist/ArtistTypeahead.vue";

const CHANGE = "change";
const EMPTY_ITEM = {
  track: "",
  artist: "",
  album: "",
  label: "",
  notes: "",
  categories: [],
};

function resetItem() {
  return Object.assign({}, EMPTY_ITEM);
}

export default {
  components: { ArtistTypeahead },
  props: {
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      item: resetItem(),
    };
  },
  emits: [CHANGE],
  methods: {
    reset() {
      this.item = resetItem();
    },
    onChange() {
      this.$emit(CHANGE);
    },
    checkValidity() {
      return this.$refs.form.checkValidity();
    },
  },
};
</script>
