<template>
  <div ref="modal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add your own item</h5>
          <button
            type="button"
            class="btn-close"
            @click="hide"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p class="text-muted">
            Add something to your crate that's not in the CHIRP library
          </p>
          <form>
            <div class="row mb-3">
              <label for="artist" class="col-2 col-form-label">Artist</label>
              <div class="col-10">
                <input id="artist" class="form-control" v-model="item.artist" />
              </div>
            </div>
            <div class="row mb-3">
              <label for="track" class="col-2 col-form-label">Track</label>
              <div class="col-10">
                <input id="track" class="form-control" v-model="item.track" />
              </div>
            </div>
            <div class="row mb-3">
              <label for="album" class="col-2 col-form-label">Album</label>
              <div class="col-10">
                <input id="album" class="form-control" v-model="item.album" />
              </div>
            </div>
            <div class="row mb-3">
              <label for="label" class="col-2 col-form-label">Label</label>
              <div class="col-10">
                <input id="label" class="form-control" v-model="item.label" />
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
        </div>
        <div class="modal-footer">
          <span v-if="error" class="text-danger">There was an error</span>
          <button
            v-if="!adding"
            type="button"
            class="btn btn-light"
            @click="hide"
          >
            Cancel
          </button>
          <button
            v-if="!adding"
            type="button"
            class="btn btn-chirp-red"
            @click="addItem"
          >
            Add item
          </button>
          <RecordSpinner v-if="adding" class="small-spinner" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.small-spinner {
  height: 2rem;
}
</style>

<script>
import Modal from "../../../node_modules/bootstrap/js/dist/modal";
import RecordSpinner from "../../components/RecordSpinner.vue";

const ADDED = "added";
const EMPTY_ITEM = {
  track: "",
  artist: "",
  album: "",
  label: "",
  notes: "",
  categories: [],
};

export default {
  components: { RecordSpinner },
  emits: [ADDED],
  props: {
    crateId: String,
  },
  data() {
    return {
      modal: undefined,
      adding: false,
      error: false,
      item: Object.assign({}, EMPTY_ITEM),
    };
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
  },
  methods: {
    show() {
      this.modal.show();
    },
    hide() {
      this.modal.hide();
      this.error = false;
      this.item = Object.assign({}, EMPTY_ITEM);
    },
    async addItem() {
      this.adding = true;

      try {
        await this.$store.dispatch("addToCrate", {
          crateId: this.crateId,
          params: { item: this.item },
        });
        this.hide();
        this.$emit(ADDED);
      } catch (error) {
        this.error = true;
      }
      this.adding = false;
    },
  },
};
</script>
