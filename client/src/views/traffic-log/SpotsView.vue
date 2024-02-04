<template>
  <div>
    <h1>Spots</h1>
    <RecordSpinner v-if="loading" />
    <div v-if="!loading" class="px-2 py-2">
      <div class="col-8 pe-3 border-end">
        <div class="row mt-3 font-sans fw-bold border-bottom">
          <div class="col-2">Title</div>
          <div class="col-2">Type</div>
          <div class="col-8">Copy</div>
        </div>
        <div
          v-for="spot in spots"
          :key="spot.id"
          class="row border-bottom py-3"
        >
          <div class="col-2">{{ spot.title }}</div>
          <div class="col-2">{{ spot.type }}</div>
          <div class="col-8">
            <SpotCopyList :spot="spot" />
          </div>
        </div>
      </div>
      <div class="col-4">
        <!-- Bulk actions -->
      </div>
    </div>
  </div>
</template>

<script>
import RecordSpinner from "../../components/RecordSpinner.vue";
import SpotCopyList from "../../components/traffic-log/SpotCopyList.vue";
import { mapStores } from "pinia";
import { useSpotsStore } from "@/stores/spots";

function sortSpotsByTitle(a, b) {
  if (a.title === b.title || !a.title || !b.title) {
    return 0;
  }
  return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
}

export default {
  components: { RecordSpinner, SpotCopyList },
  computed: {
    ...mapStores(useSpotsStore),
    loading() {
      return this.spotsStore.loadingSpots;
    },
    spots() {
      return this.spotsStore.spots.sort(sortSpotsByTitle);
    },
  },
  mounted() {
    if (!this.spotsStore.loadedSpots) {
      this.spotsStore.getSpots();
    }
  },
};
</script>
