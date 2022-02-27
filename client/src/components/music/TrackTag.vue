<template>
  <font-awesome-icon :class="classObject" :icon="icon" />
</template>

<style scoped>
.hidden {
  visibility: hidden;
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
        return "ban";
      } else if (this.recommended) {
        return "star";
      } else {
        return "star";
      }
    },
    classObject() {
      return {
        hidden: !this.explicit && !this.recommended,
        "text-warning": this.recommended,
        "text-danger": this.explicit,
      };
    },
  },
};
</script>
