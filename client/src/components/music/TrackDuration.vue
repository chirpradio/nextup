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
      const inSeconds = this.track.duration_ms / 1000;
      const minutes = Math.trunc(inSeconds / 60);
      const seconds = Math.round(inSeconds % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    },
  },
};
</script>
