<template>
  <button
    class="btn btn-link-chirp-red check-all p-0"
    v-if="showCheckAll"
    @click="checkAll"
  >
    check all
  </button>
  <ul v-for="copy in filteredCopy" :key="copy.id" class="list-group">
    <SpotCopyItem
      :copy="copy"
      class="list-group-item mb-2"
      v-model="selected[copy.id]"
    />
  </ul>
  <router-link
    :to="{ name: 'addSpotCopy', params: { spotId: spot.id } }"
    class="btn btn-chirp-red"
  >
    <font-awesome-icon icon="plus" />
  </router-link>
</template>

<style scoped>
.check-all {
  font-size: 0.75rem;
}
</style>

<script>
import SpotCopyItem from "./SpotCopyItem.vue";
import { copyStarted } from "../functions";

const SELECT = "select";

export default {
  name: "SpotCopyList",
  components: { SpotCopyItem },
  emits: [SELECT],
  data() {
    return {
      selected: {},
    };
  },
  props: {
    spot: {
      type: Object,
      required: true,
    },
    future: Boolean,
  },
  watch: {
    spot: {
      handler() {
        if (Array.isArray(this.spot.copy)) {
          this.spot.copy.forEach((copy) => {
            this.selected[copy.id] = false;
          });
        }
      },
      immediate: true,
    },
    selected: {
      handler(newSelected) {
        const selectedIds = [];
        for (const [key, value] of Object.entries(newSelected)) {
          if (value) selectedIds.push(key);
        }
        this.$emit(SELECT, {
          [this.spot.id]: this.spot.copy.filter((copy) =>
            selectedIds.includes(copy.id)
          ),
        });
      },
      deep: true,
    },
  },
  computed: {
    filteredCopy() {
      if (this.future) {
        return this.spot.copy.filter(
          (copy) => copy.start_on && !copyStarted(copy.start_on)
        );
      }

      return this.spot.copy || [];
    },
    showCheckAll() {
      return this.filteredCopy.length > 1;
    },
  },
  methods: {
    checkAll() {
      for (const id in this.selected) {
        this.selected[id] = true;
      }
    },
    clearAll() {
      for (const id in this.selected) {
        this.selected[id] = false;
      }
    },
  },
};
</script>
