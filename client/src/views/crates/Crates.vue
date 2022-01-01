<template>
  <div class="container-fluid">
    <div class="d-flex">
      <h1 class="flex-grow-1">My Crates</h1>
      <button class="btn btn-chirp-red" @click="showModal">Add a crate</button>
    </div>
    <ul v-if="!loading && crates.length" class="list-group list-group-flush">
      <CratePreview
        v-for="crate in crates"
        :key="crate.id"
        :crate="crate"
        class="list-group-item"
      />
    </ul>
    <RecordSpinner v-if="loading" />

    <div id="addCrateModal" class="modal">
      <form class="modal-dialog" @submit.prevent="onAddCrate">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a crate</h5>
            <button
              type="button"
              class="btn-close"
              @click="hideModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <label for="crateName" class="form-label">Crate name</label>
            <input class="form-control" id="crateName" v-model="newCrateName" />
            <div class="form-text">
              You must enter a name for the new crate.
            </div>
          </div>
          <div class="modal-footer">
            <button
              v-if="!adding"
              type="button"
              class="btn btn-light"
              @click="hideModal"
            >
              Cancel
            </button>
            <button
              v-if="!adding"
              type="submit"
              class="btn btn-chirp-red"
              :disabled="preventAdd"
            >
              Add
            </button>
            <RecordSpinner v-if="adding" class="small-spinner" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.small-spinner {
  height: 2rem;
}
</style>

<script>
import CratePreview from "./CratePreview";
import RecordSpinner from "../../components/RecordSpinner";
import updateTitle from "../../mixins/updateTitle";
import Modal from "../../../node_modules/bootstrap/js/dist/modal";

let addModal;

export default {
  name: "Crates",
  components: { CratePreview, RecordSpinner },
  mixins: [updateTitle],
  created() {
    this.updateTitle("My Crates");
  },
  data() {
    return {
      newCrateName: "",
      adding: false,
    };
  },
  computed: {
    crates() {
      return this.$store.getters.crates;
    },
    loading() {
      return this.$store.getters.loadingCrates;
    },
    preventAdd() {
      return this.newCrateName === "";
    },
  },
  mounted() {
    addModal = new Modal(document.getElementById("addCrateModal"));
  },
  methods: {
    showModal() {
      addModal.show();
    },
    hideModal() {
      addModal.hide();
    },
    async onAddCrate() {
      this.adding = true;
      const crate = await this.$store.dispatch("addCrate", {
        name: this.newCrateName,
      });
      addModal.hide();
      this.adding = false;
      this.$router.push({ name: "crate", params: { id: crate.id } });
    },
  },
};
</script>
