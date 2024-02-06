<template>
  <div class="px-3">
    <div class="d-inline-flex">
      <h1>Spots</h1>
    </div>
    <RecordSpinner v-if="loading" />
    <div v-if="!loading" class="py-2">
      <div class="col-8 pe-3 border-end">
        <router-link :to="{ name: 'addSpot' }" class="btn btn-chirp-red mt-3"
          >Add a new spot</router-link
        >
        <div class="row mt-4 font-sans fw-bold border-bottom">
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

export default {
  components: { RecordSpinner, SpotCopyList },
  computed: {
    ...mapStores(useSpotsStore),
    loading() {
      return this.spotsStore.loadingSpots;
    },
    spots() {
      return this.spotsStore.spots;
    },
  },
  mounted() {
    if (!this.spotsStore.loadedSpots) {
      this.spotsStore.getSpots();
    }
  },
};
</script>
