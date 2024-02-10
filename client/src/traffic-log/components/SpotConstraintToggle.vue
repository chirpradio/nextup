<template>
  <input
    type="checkbox"
    class="btn-check"
    :id="id"
    :checked="modelValue"
    @click="$emit('update:modelValue', $event.target.checked)"
    autocomplete="off"
  />
  <label class="btn btn-sm btn-outline-dark w-100 text-start" :for="id">{{
    label
  }}</label>
</template>

<script>
export default {
  props: {
    hour: Number,
    weekday: String,
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    id() {
      return `constraint-${this.weekday}-${this.hour}`;
    },
    label() {
      if (this.hour >= 13) {
        return `${this.hour - 12}pm`;
      } else if (this.hour < 12 && this.hour > 0) {
        return `${this.hour}am`;
      } else if (this.hour === 0) {
        return "12am";
      } else if (this.hour === 12) {
        return "12pm";
      }
      return "";
    },
  },
};
</script>
