<template>
  <div class="p-3">
    <h1>Add Spot Copy</h1>
    <SpotCopyForm :copy="copy" :spots="spots" @save="onSave" />
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useSpotsStore } from "../store";
import SpotCopyForm from "../components/SpotCopyForm.vue";

export default {
  props: {
    spotId: String,
  },
  components: { SpotCopyForm },
  computed: {
    ...mapStores(useSpotsStore),
    copy() {
      return {
        spot: {
          id: this.spotId,
        },
      };
    },
    spots() {
      return this.spotsStore.spots;
    },
  },
  methods: {
    async onSave(event) {
      try {
        await this.spotsStore.addCopyToSpot({
          spotId: event.spot,
          copy: event,
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
