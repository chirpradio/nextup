<template>
  <span>{{ duration }}</span>
</template>

<script>
export default {
  name: "TrackDuration",
  props: {
    track: Object,
  },
  computed: {
    duration() {
      if (!this.track || !this.track.duration_ms) {
        return "";
      }

      const inSeconds = this.track.duration_ms / 1000;
      let minutes = Math.trunc(inSeconds / 60);
      let seconds = Math.floor(inSeconds % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    },
  },
};
</script>
