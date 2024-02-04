<template>
  <ul v-for="copy in spot.copy" :key="copy.id" class="list-group">
    <SpotCopyItem :copy="copy" class="list-group-item mb-2" />
  </ul>
  <router-link
    :to="{ name: 'addSpotCopy', params: { spotId: spot.id } }"
    class="btn btn-chirp-red"
  >
    <font-awesome-icon icon="plus" />
  </router-link>
</template>

<script>
import SpotCopyItem from "./SpotCopyItem.vue";

export default {
  name: "SpotCopyList",
  components: { SpotCopyItem },
  data() {
    return {};
  },
  props: {
    spot: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  methods: {},
};
</script>
