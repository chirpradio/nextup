<template>
  <font-awesome-icon
    :class="classes"
    :icon="icon"
    :title="text"
    :aria-label="text"
  />
</template>

<script>
import trackMixins from "@/mixins/track";

export default {
  name: "TrackTag",
  props: {
    displayWhenSmall: {
      type: Boolean,
      default: true,
    },
    track: Object,
  },
  mixins: [trackMixins],
  computed: {
    explicit() {
      return this.isExplicit(this.track);
    },
    recommended() {
      return this.isRecommended(this.track);
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
    text() {
      if (this.explicit) {
        return "explicit";
      } else if (this.recommended) {
        return "recommended";
      }

      return "";
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
