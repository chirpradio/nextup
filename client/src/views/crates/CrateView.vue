<template>
  <div ref="container" class="px-0">
    <div class="d-flex mb-3 py-2 px-3 bg-white align-items-center">
      <div class="d-flex align-items-center flex-grow-1">
        <EditableHeading
          v-if="crate"
          :headingLevel="1"
          :text="name"
          @save="renameCrate"
          aria-label="Edit crate name"
          title="Edit crate name"
          class="me-3"
        />
        <button
          v-if="!loading"
          class="btn btn-outline-chirp-red btn-sm h-50"
          @click="showAddModal"
        >
          Add your own item
        </button>
      </div>
      <span class="flex-grow-1"></span>
      <button class="btn btn-link-chirp-red btn-sm" @click="showDeleteModal">
        Delete crate
      </button>
    </div>

    <draggable
      v-if="showList"
      :list="items"
      item-key="element.encodedKey"
      @change="onMove"
      tag="ol"
      class="list-group list-group-flush"
      handle=".crate-item__handle"
    >
      <template #item="{ element, index }">
        <li class="list-group-item">
          <div class="row g-2">
            <div class="crate-item__handle col-auto">
              <font-awesome-icon icon="grip-lines" />
            </div>
            <div class="col-1 me-2 text-end numeral crate-item__duration">
              <TrackDuration v-if="element.track" :track="element.track" />
            </div>
            <component
              :is="getKind(element)"
              :element="element"
              class="col crate-item__details"
            />
            <div class="col-1">
              <button
                class="btn btn-link-chirp-red btn-sm"
                @click="removeItem(index)"
                aria-label="Remove from crate"
                title="Remove from crate"
              >
                <font-awesome-icon icon="xmark" />
              </button>
            </div>
          </div>
        </li>
      </template>
    </draggable>
    <div v-if="!showList && !loading" class="ps-3">This crate is empty</div>
    <div class="row g-2 mt-1 pt-1 border-top">
      <div class="col-12 ps-4">
        <button
          v-if="!loading"
          class="btn btn-outline-chirp-red"
          @click="showAddModal"
        >
          Add your own item
        </button>
      </div>
    </div>
    <RecordSpinner v-if="loading" />
    <AddCrateItemModal :crateId="id" ref="addModal" @added="scrollToBottom" />

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
  </div>
</template>

<style>
@media (max-width: 576px) {
  .crate-item__duration,
  .crate-item__details {
    font-size: 0.9rem;
  }

  .crate-item__details {
    word-break: break-word;
  }

  .crate-item__duration {
    padding: 0;
  }
}

.crate-item__handle {
  cursor: move;
}

.sortable-ghost {
  background-color: var(--bright-red);
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>

<script>
import EditableHeading from "@/components/EditableHeading.vue";
import RecordSpinner from "@/components/RecordSpinner.vue";
import TrackDuration from "@/components/music/TrackDuration.vue";
import draggable from "vuedraggable";
import { Modal } from "bootstrap";
import AlbumItem from "@/components/crates/AlbumItem.vue";
import ArtistItem from "@/components/crates/ArtistItem.vue";
import CrateItem from "@/components/crates/CrateItem.vue";
import TrackItem from "@/components/crates/TrackItem.vue";
import AddCrateItemModal from "@/components/crates/AddCrateItemModal.vue";
import updateTitle from "@/mixins/updateTitle";
import { mapStores } from "pinia";
import { useCratesStore } from "@/stores/crates";

let deleteModal;

export default {
  name: "CrateView",
  components: {
    EditableHeading,
    RecordSpinner,
    TrackDuration,
    draggable,
    AlbumItem,
    ArtistItem,
    CrateItem,
    TrackItem,
    AddCrateItemModal,
  },
  props: {
    id: String,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapStores(useCratesStore),
    crate() {
      return this.cratesStore.crate(this.id);
    },
    items() {
      return this.cratesStore.crateItems(this.id);
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
      return this.crate && this.items && this.items.length && !this.loading;
    },
  },
  created: async function () {
    try {
      this.loading = true;
      await this.cratesStore.getCrate({ crateId: this.id });
      await this.cratesStore.getCrateItems({
        crateId: this.id,
      });
      this.loading = false;
    } catch (err) {
      if (err.status === 403) {
        this.$router.replace("/");
      }
    }
  },
  mounted() {
    deleteModal = new Modal(document.getElementById("deleteModal"));
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
    async removeItem(index) {
      await this.cratesStore.removeItem({
        crateId: this.id,
        index,
      });
    },
    async onMove(evt) {
      await this.cratesStore.reorderItem({
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
      this.$refs.addModal.show();
    },
    async deleteCrate() {
      this.hideDeleteModal();
      this.loading = true;
      await this.cratesStore.deleteCrate({ crateId: this.id });
      this.$router.push({ path: "/crates" });
    },
    scrollToBottom() {
      const el = document.scrollingElement;
      el.scrollTo(0, el.scrollHeight);
    },
    async renameCrate(event) {
      this.cratesStore.renameCrate({
        crateId: this.id,
        name: event.value,
      });
    },
  },
};
</script>
