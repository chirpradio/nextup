<template>
  <div class="container-fluid">
    <div class="d-flex mb-3 sticky-top py-2 bg-white align-items-center">
      <EditableHeading
        v-if="crate"
        :headingLevel="1"
        :text="name"        
        @save="renameCrate"
        aria-label="Edit crate name"
        title="Edit crate name"
        class="me-3"
      />
      <button v-if="!loading" class="btn btn-chirp-red btn-sm h-50" @click="showAddModal">
        Add your own item
      </button>
      <span class="flex-grow-1"></span>
      <button class="btn btn-link-chirp-red btn-sm" @click="showDeleteModal">
        Delete crate
      </button>
    </div>
    
    <draggable
      v-if="showList"
      :list="crate.items"
      item-key="element.encodedKey"
      @change="onMove"
      tag="ol"
      class="list-group list-group-flush"
      handle=".handle"
    >
      <template #item="{ element, index }">
        <li class="list-group-item d-flex align-items-start">
          <div class="row flex-fill">
            <div class="handle col-auto">
              <font-awesome-icon icon="grip-lines" />            
            </div>        
            <div class="col-1 mb-1 text-end">
              <TrackDuration v-if="element.track" :track="element.track" />
            </div>  
            <component
              :is="getKind(element)"
              :element="element"
              class="col-12 flex-grow-1 col-md-6"
            />                 
            <div class="col-1">
              <button
                class="btn btn-link-chirp-red btn-sm"
                @click="removeItem(index)"
                aria-label="Remove from crate"
                title="Remove from crate"
              >
                <font-awesome-icon icon="times" />
              </button>
            </div>
          </div>
        </li>
      </template>
    </draggable>
    <div v-if="!showList && !loading">This crate is empty</div>
    <RecordSpinner v-if="loading" />

    <div id="deleteModal" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete crate</h5>
            <button
              type="button"
              class="btn-close"
              @click="hideDeleteModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete “{{ name }}”?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              @click="hideDeleteModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-chirp-red"
              @click="deleteCrate"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="addModal" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add your own item</h5>
            <button
              type="button"
              class="btn-close"
              @click="hideAddModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">Add something to your crate that's not in the CHIRP library</p>
            <form>
              <div class="row mb-3">
                <label for="artist" class="col-2 col-form-label">Artist</label>
                <div class="col-10">
                  <input
                    id="artist"
                    class="form-control"
                    v-model="item.artist"
                  />
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
                    <input class="form-check-input" type="radio" name="localRadios" id="localNone" v-model="item.category" value="" checked>
                    <label class="form-check-label" for="localRadios">
                      None
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="localRadios" id="localClassic" v-model="item.category" value="local_classic">
                    <label class="form-check-label" for="localRadios">
                      Local Classic
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="localRadios" id="localCurrent" v-model="item.category" value="local_current">
                    <label class="form-check-label" for="localRadios">
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
            <span v-if="addError" class="text-danger">There was an error</span>
            <button
              v-if="!adding"
              type="button"
              class="btn btn-light"
              @click="hideAddModal"
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
  </div>
</template>

<style scoped>
.handle {
  cursor: move;
}

.small-spinner {
  height: 2rem;
}
</style>

<script>
import EditableHeading from "../../components/EditableHeading";
import RecordSpinner from "../../components/RecordSpinner";
import TrackDuration from "../../components/music/TrackDuration";
import draggable from "vuedraggable";
import Modal from "../../../node_modules/bootstrap/js/dist/modal";
import AlbumItem from "../../components/crates/AlbumItem";
import ArtistItem from "../../components/crates/ArtistItem";
import CrateItem from "../../components/crates/CrateItem";
import TrackItem from "../../components/crates/TrackItem";
import updateTitle from "../../mixins/updateTitle";

let deleteModal, addModal;

export default {
  name: "Crate",
  components: {
    EditableHeading,
    RecordSpinner,
    TrackDuration,
    draggable,
    AlbumItem,
    ArtistItem,
    CrateItem,
    TrackItem,
  },
  props: {
    id: String,
  },
  data() {
    return {
      loading: false,
      adding: false,
      addError: false,
      item: {
        track: "",
        artist: "",
        album: "",
        label: "",
        notes: "",
        category: "",
      },
    };
  },
  computed: {
    crate() {
      return this.$store.getters.crate(this.id);
    },
    name() {
      let name = "";
      if (this.crate) {
        name = this.crate.name || "<No name>";
      }

      this.updateTitle(name);
      return name;
    },
    showList() {
      return this.crate && this.crate.items && this.crate.items.length;
    },
    items: {
      get() {
        return this.crate.items;
      },
      set(value) {
        this.$store.commit("allCrateItems", { crateId: this.id, items: value });
      },
    },
  },
  created: async function () {
    this.loading = true;
    await this.$store.dispatch("getCrateItems", {
      crateId: this.id,
    });
    this.loading = false;
  },
  mounted() {
    deleteModal = new Modal(document.getElementById("deleteModal"));
    addModal = new Modal(document.getElementById("addModal"));
  },
  mixins: [updateTitle],
  methods: {
    artistName(item) {
      if (item.artist) {
        return item.artist.name;
      } else if (item.track && item.track.track_artist) {
        return item.track.track_artist.name;
      } else {
        return "";
      }
    },
    getKind(item) {
      return item.kind === "CrateItem" ? item.kind : `${item.kind}Item`;
    },
    async loadMore() {
      this.loading = true;
      await this.$store.dispatch("getCrateItems", {
        crateId: this.id,
        more: true,
      });
      this.loading = false;
    },
    async removeItem(index) {
      await this.$store.dispatch("removeItem", {
        crateId: this.id,
        index,
      });
    },
    async onMove(evt) {
      await this.$store.dispatch("reorderItem", {
        crateId: this.id,
        index: evt.moved.oldIndex,
        newIndex: evt.moved.newIndex,
      });
    },
    showDeleteModal() {
      deleteModal.show();
    },
    hideDeleteModal() {
      deleteModal.hide();
    },
    showAddModal() {
      addModal.show();
    },
    hideAddModal() {
      addModal.hide();
      this.addError = false;
      this.item = {
        track: "",
        artist: "",
        album: "",
        label: "",
        notes: "",
        category: "",
      };
    },
    deleteCrate() {
      this.hideDeleteModal();
      this.$store.dispatch("deleteCrate", { crateId: this.id });
      this.$router.push({ path: "/crates" });
    },
    async addItem() {
      this.adding = true;

      try {
        const newItem = { ...this.item };
        if(newItem.category !== "") {
          newItem.categories = [newItem.category];
        }
        delete newItem.category;     

        await this.$store.dispatch("addToCrate", {
          crateId: this.id,
          params: { item: newItem },
        });
        this.hideAddModal();
      } catch (error) {
        this.addError = true;
      }

      this.adding = false;
    },
    async renameCrate(event) {
      this.$store.dispatch("renameCrate", {
        crateId: this.id,
        name: event.value,
      });
    },
  },
};
</script>
