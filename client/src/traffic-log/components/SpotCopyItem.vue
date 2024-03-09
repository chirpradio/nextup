<template>
  <li class="spot-copy-item d-inline-flex" :class="classes">
    <input
      :id="id"
      type="checkbox"
      class="form-check-input me-2"
      :checked="modelValue"
      @click="$emit('update:modelValue', $event.target.checked)"
      :value="copy.id"
    />
    <label
      class="flex-grow-1 h-100 overflow-hidden fw-normal font-serif me-2"
      :for="id"
    >
      <span>{{ title }}</span>
      <span v-if="!started"> (not started)</span>
    </label>
    <router-link
      :to="{
        name: 'editSpotCopy',
        params: { spotId: copy.spot.id, copyId: copy.id },
      }"
    >
      <font-awesome-icon
        icon="fa-regular fa-pen-to-square"
        class="mt-1"
        title="edit copy"
      />
    </router-link>
  </li>
</template>

<style scoped>
.spot-copy-item {
  height: 2.5rem;
}
</style>

<script>
import { copyStarted } from "../functions";

export default {
  name: "SpotCopyItem",
  data() {
    return {};
  },
  props: {
    copy: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    id() {
      return `${this.copy.id}Check`;
    },
    title() {
      return this.copy.name || this.copy.body;
    },
    started() {
      return copyStarted(this.copy.start_on);
    },
    classes() {
      return {
        "bg-warning-subtle": this.started,
        "bg-light": !this.started,
      };
    },
  },
};
</script>
