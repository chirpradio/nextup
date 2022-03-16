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

export default {
  components: { RecordSpinner },
  computed: {
    loading() {
      return this.$store.getters["spots/loadingSpots"];
    },
    spots() {
      return this.$store.getters["spots/spots"];
    },
  },
  mounted() {
    this.$store.dispatch("spots/getSpots");
  },
};
</script>
