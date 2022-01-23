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

<script setup>
/* eslint-disable no-unused-vars */
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import RecordSpinner from "../../components/RecordSpinner.vue";

const store = useStore();
const spot = computed(() => store.getters["spots/spots"]);
const loading = computed(() => store.getters["spots/loadingSpots"]);

onMounted(() => {
  store.dispatch("spots/getSpots");
});
</script>
