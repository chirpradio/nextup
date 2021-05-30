<template>
  <span :class="classObject">🚫</span>
</template>

<style scoped>
  .grayscale {
    filter: grayscale(1);
    opacity: 25%;
  }
</style>

<script>
export default {
  name: "TrackExplicit",
  props: {
    track: Object,
  },
  computed: {
    explicit () {
      return this.track && this.track.current_tags && this.track.current_tags.includes("explicit");
    },
    classObject () {
      return {
        "grayscale": !this.explicit
      }
    },
  },
}
</script>