<template>
  <li class="spot-copy-item d-inline-flex">
    <!-- <input type="checkbox" class="form-check-input me-2" /> -->
    <span class="flex-grow-1 h-100 overflow-hidden me-2">
      {{ title }}
    </span>
    <router-link
      :to="{
        name: 'editSpotCopy',
        params: { spotId: copy.spot.id, copyId: copy.id },
      }"
    >
      <font-awesome-icon icon="fa-regular fa-pen-to-square" class="mt-1" />
    </router-link>
  </li>
</template>

<style scoped>
.spot-copy-item {
  height: 2.5rem;
}
</style>

<script>
export default {
  name: "SpotCopyItem",
  data() {
    return {
      checked: false,
    };
  },
  props: {
    copy: {
      type: Object,
      required: true,
    },
  },
  computed: {
    title() {
      return this.copy.name || this.copy.body;
    },
  },
  methods: {},
};
</script>
