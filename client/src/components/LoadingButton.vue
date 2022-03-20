<template>
  <button class="btn" :class="classes" :disabled="loading">
    <font-awesome-icon v-if="!loading" :icon="icon" />
    <RecordSpinner
      v-if="loading"
      size="xs"
      :reverse="!outline"
      class="nudge-up"
    />
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
      const obj = {};
      const colorClass = this.outline
        ? "btn-outline-chirp-red"
        : "btn-chirp-red";
      obj[colorClass] = true;
      return obj;
    },
  },
};
</script>
