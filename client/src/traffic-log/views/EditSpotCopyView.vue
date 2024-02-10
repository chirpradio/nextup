<template>
  <div class="p-3">
    <h1>Edit Spot Copy</h1>
    <RecordSpinner v-if="loading" />
    <SpotCopyForm :copy="copy" :spots="spots" @save="onSave" v-if="!loading" />
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useSpotsStore } from "../store";
import SpotCopyForm from "../components/SpotCopyForm.vue";
import RecordSpinner from "../../components/RecordSpinner.vue";

export default {
  props: {
    spotId: String,
    copyId: String,
  },
  components: { SpotCopyForm, RecordSpinner },
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
        this.$router.back();
      } catch (error) {
        console.error(error);
      }
    },
  },
  async created() {
    if (!this.spotsStore.loadedSpots) {
      await this.spotsStore.getSpots();
    }
  },
};
</script>
