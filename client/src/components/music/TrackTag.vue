<template>
  <span :class="classObject">{{ icon }}</span>
</template>

<style scoped>
.nopacity {
  opacity: 0;
}
</style>

<script>
export default {
  name: "TrackExplicit",
  props: {
    track: Object,
  },
  computed: {
    explicit() {
      return (
        this.track &&
        this.track.current_tags &&
        this.track.current_tags.includes("explicit")
      );
    },
    recommended() {
      return (
        this.track &&
        this.track.current_tags &&
        this.track.current_tags.includes("recommended")
      );
    },
    icon() {
      if (this.explicit) {
        return "🚫";
      } else if (this.recommended) {
        return "⭐️";
      } else {
        return "➕";
      }
    },
    classObject() {
      return {
        nopacity: !this.explicit && !this.recommended,
      };
    },
  },
};
</script>
