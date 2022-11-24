<template>
  <button class="btn" :class="classes" :disabled="loading">
    <font-awesome-icon v-if="!loading" :icon="icon" />
    <RecordSpinner v-if="loading" size="xs" class="nudge-up" />
    {{ label }}
  </button>
</template>

<style scoped>
.nudge-up {
  position: relative;
  top: -0.2em;
}
</style>

<script>
import RecordSpinner from "./RecordSpinner.vue";

export default {
  components: { RecordSpinner },
  props: {
    icon: String,
    label: String,
    small: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        "btn-outline-chirp-red": this.outline,
        "btn-chirp-red": !this.outline,
        "btn-sm": this.small,
      };
    },
  },
};
</script>
