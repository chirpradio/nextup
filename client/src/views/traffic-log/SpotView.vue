<template>
  <div>
    <h1>{{ spot.title }}</h1>
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
    spots() {
      return this.spotsStore.spots;
    },
    loading() {
      return this.spotsStore.loadingSpots;
    },
  },
  mounted() {
    this.spotsStore.getSpots();
  },
};
</script>
