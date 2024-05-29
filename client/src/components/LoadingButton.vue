<template>
  <button class="btn" :class="classes" :disabled="disabled">
    <font-awesome-icon v-if="icon && !loading" :icon="icon" />
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
    small: {
      type: Boolean,
      default: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      const obj = {};
      const colorClass = this.outline
        ? "btn-outline-chirp-red"
        : "btn-chirp-red";
      obj[colorClass] = true;
      obj["btn-sm"] = this.small;
      return obj;
    },
    disabled() {
      return this.disable || this.loading;
    },
  },
};
</script>
