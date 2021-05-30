<template>
  <span :class="classObject">⭐️</span>
</template>

<style scoped>
  .grayscale {
    filter: grayscale(1);
    opacity: 33%;
  }
</style>

<script>
export default {
  name: "TrackRecommended",
  props: {
    track: Object,
  },
  computed: {
    recommended () {
      return this.track && this.track.current_tags && this.track.current_tags.includes("recommended");
    },
    classObject () {
      return {
        "grayscale": !this.recommended
      }
    },
  },
}
</script>