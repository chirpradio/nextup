<template>
  <div>
    <h1>Spots</h1>
    <RecordSpinner v-if="loading" />
    <ul v-if="!loading" class="list-group">
      <li v-for="spot in spots" :key="spot.id" class="list-group-item">
        {{ spot.title }} ({{ spot.type }})
      </li>
    </ul>
  </div>
</template>

<script>
import RecordSpinner from "../../components/RecordSpinner.vue";
import { mapStores } from "pinia";
import { useSpotsStore } from "@/stores/spots";

export default {
  components: { RecordSpinner },
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
    this.spotsStore.getSpots();
  },
};
</script>
