<template>
  <font-awesome-icon :class="classes" :icon="icon" />
</template>

<script>
export default {
  name: "TrackTag",
  props: {
    displayWhenSmall: {
      type: Boolean,
      default: true,
    },
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
    classes() {
      const classes = {
        "text-warning": this.recommended,
        "text-danger": this.explicit,
      };

      const empty = !this.explicit && !this.recommended;
      if (empty === true) {
        const emptyClassName = this.getEmptyClassName();
        classes[emptyClassName] = true;
      }

      return classes;
    },
  },
  methods: {
    getEmptyClassName() {
      if (this.displayWhenSmall === false) {
        const smallOrBelow = window.matchMedia("(max-width: 767px)");
        if (smallOrBelow.matches === true) {
          return "d-none";
        }
      }

      return "invisible";
    },
  },
};
</script>
