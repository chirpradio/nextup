<template>
  <div class="p-3">
    <h1>Edit Spot Copy</h1>
    <SpotCopyForm :copy="copy" @save="onSave" />
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useSpotsStore } from "@/stores/spots";
import SpotCopyForm from "../../components/traffic-log/SpotCopyForm.vue";

export default {
  props: {
    spotId: String,
    copyId: String,
  },
  components: { SpotCopyForm },
  computed: {
    ...mapStores(useSpotsStore),
    copy() {
      return this.spotsStore.copy(this.spotId, this.copyId);
    },
    spots() {
      return this.spotsStore.spots;
    },
  },
  methods: {
    async onSave(event) {
      try {
        await this.spotsStore.updateCopy({
          copy: this.copy,
          data: event,
        });
        this.$router.back();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
