<template>
  <div class="p-3">
    <h1>Edit Spot Copy</h1>
    <RecordSpinner v-if="loading" />
    <div class="row">
      <SpotCopyForm
        :copy="copy"
        :spots="spots"
        @save="onSave"
        v-if="!loading"
        class="col-8 border-end"
      />
      <div class="col-4">
        <button class="btn btn-outline-chirp-red w-100" @click="confirmDelete">
          Delete copy
        </button>
      </div>
    </div>

    <ModalDialog ref="deleteModal" title="Delete copy" @confirm="deleteCopy">
      <span>Are you sure you want to delete this copy?</span>
    </ModalDialog>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useSpotsStore } from "../store";
import SpotCopyForm from "../components/SpotCopyForm.vue";
import RecordSpinner from "../../components/RecordSpinner.vue";
import ModalDialog from "../../components/ModalDialog.vue";

export default {
  props: {
    spotId: String,
    copyId: String,
  },
  components: { SpotCopyForm, RecordSpinner, ModalDialog },
  computed: {
    ...mapStores(useSpotsStore),
    spots() {
      return this.spotsStore.spots;
    },
    copy() {
      return this.spotsStore.copy(this.spotId, this.copyId);
    },
    loading() {
      return this.spotsStore.loadingSpots;
    },
  },
  methods: {
    async onSave(event) {
      try {
        await this.spotsStore.updateCopy({
          copy: this.copy,
          body: event,
        });
        this.$router.push({ name: "spots" });
      } catch (error) {
        console.error(error);
      }
    },
    confirmDelete() {
      this.$refs.deleteModal.show();
    },
    deleteCopy() {
      this.spotsStore.deleteCopy(this.copy);
      this.$refs.deleteModal.hide();
      this.$router.push({ name: "spots" });
    },
  },
  async created() {
    if (!this.spotsStore.loadedSpots) {
      await this.spotsStore.getSpots();
    }
  },
};
</script>
