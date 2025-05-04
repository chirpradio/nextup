<template>
  <form ref="form">
    <div v-if="single" class="row mb-3">
      <div class="col-2">
        <label for="single" class="col-form-label pb-0">Single</label>
        <span v-if="required" class="form-text">required</span>
      </div>
      <div class="col-10">
        <input
          id="single"
          class="form-control"
          v-model="item.single"
          :required="required"
          @change="onChange"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2">
        <label for="artist" class="col-form-label pb-0">Artist</label>
        <span v-if="required" class="form-text">required</span>
      </div>
      <div class="col-10">
        <ArtistTypeahead
          v-model="item.artist"
          :required="required"
          @update:model-value="onChange"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2">
        <label for="track" class="col-form-label pb-0">Track</label>
        <span v-if="required" class="form-text">required</span>
      </div>
      <div class="col-10">
        <input
          id="track"
          class="form-control"
          v-model="item.track"
          :required="required"
          :disabled="disabled"
          @change="onChange"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2">
        <label for="album" class="col-form-label pb-0">Album</label>
        <span v-if="required" class="form-text">required</span>
      </div>
      <div class="col-10">
        <input
          id="album"
          class="form-control"
          v-model="item.album"
          :required="required"
          :disabled="disabled"
          @change="onChange"
        />
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-2">
        <label for="label" class="col-form-label pb-0">Label</label>
        <span v-if="required" class="form-text">required</span>
      </div>
      <div class="col-10">
        <input
          id="label"
          class="form-control"
          v-model="item.label"
          :required="required"
          :disabled="disabled"
          @change="onChange"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-2 col-form-label">Category</label>
      <div class="col-10">
        <div class="d-flex d-flex-row mt-2">
          <div class="form-check me-4">
            <input
              id="heavyRotation"
              class="form-check-input"
              type="checkbox"
              v-model="item.categories"
              :value="HEAVY_ROTATION"
              @change="onCategoryChange"
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
              :value="LIGHT_ROTATION"
              @change="onCategoryChange"
            />
            <label class="form-check-label" for="lightRotation">
              Light Rotation
            </label>
          </div>
        </div>
        <div class="d-flex d-flex-row mt-2">
          <div class="form-check me-4">
            <input
              id="localClassic"
              class="form-check-input"
              type="checkbox"
              v-model="item.categories"
              :value="LOCAL_CLASSIC"
              @change="onCategoryChange"
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
              :value="LOCAL_CURRENT"
              @change="onCategoryChange"
            />
            <label class="form-check-label" for="localCurrent">
              Local Current
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label for="notes" class="col-2 col-form-label">Notes</label>
      <div class="col-10">
        <input
          id="notes"
          class="form-control"
          v-model="item.notes"
          @change="onChange"
        />
      </div>
    </div>
  </form>
</template>

<script>
import ArtistTypeahead from "./music/search/artist/ArtistTypeahead.vue";

const CHANGE = "change";
const EMPTY_ITEM = {
  single: "",
  track: "",
  artist: "",
  album: "",
  label: "",
  notes: "",
  categories: [],
};

const HEAVY_ROTATION = "heavy_rotation";
const LIGHT_ROTATION = "light_rotation";
const LOCAL_CLASSIC = "local_classic";
const LOCAL_CURRENT = "local_current";

function resetItem() {
  return Object.assign({}, EMPTY_ITEM);
}

export default {
  components: { ArtistTypeahead },
  props: {
    single: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    track: {
      type: Object,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      item: {},
      HEAVY_ROTATION,
      LIGHT_ROTATION,
      LOCAL_CLASSIC,
      LOCAL_CURRENT,
    };
  },
  beforeMount() {
    if (this.track) {
      this.item = {
        track: this.track.track?.title,
        artist: this.track.artist?.name || this.track.track_artist?.name,
        album: this.track.album?.title,
        label: this.track.album?.label,
        notes: this.track.notes,
        categories: this.track.categories,
      };
    } else {
      this.item = resetItem();
    }
  },
  emits: [CHANGE],
  methods: {
    reset() {
      this.item = resetItem();
    },
    onChange() {
      this.$emit(CHANGE, this.item);
    },
    checkValidity() {
      return this.$refs.form.checkValidity();
    },
    onCategoryChange(event) {
      let index = -1;
      switch (event.target.value) {
        case HEAVY_ROTATION:
          index = this.item.categories.indexOf(LIGHT_ROTATION);
          break;
        case LIGHT_ROTATION:
          index = this.item.categories.indexOf(HEAVY_ROTATION);
          break;
        case LOCAL_CLASSIC:
          index = this.item.categories.indexOf(LOCAL_CURRENT);
          break;
        case LOCAL_CURRENT:
          index = this.item.categories.indexOf(LOCAL_CLASSIC);
          break;
      }
      if (index > -1) {
        this.item.categories.splice(index, 1);
      }
      this.$emit(CHANGE, this.item);
    },
  },
};
</script>
