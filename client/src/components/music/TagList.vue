<template>
  <ul class="list-inline">
    <li
      v-for="tag in filteredTags"
      :key="tag"
      class="list-inline-item badge rounded-pill bg-light border fw-normal text-body"
    >
      <font-awesome-icon :class="getCircleClass(tag)" icon="circle" size="sm" />
      {{ formatTag(tag) }}
    </li>
  </ul>
</template>

<style scoped>
.heavy_rotation {
  color: #cb3f30;
}

.light_rotation {
  color: #5f9676;
}

.local_classic {
  color: #ffbe40;
}

.local_current {
  color: #0e7c7c;
}
</style>

<script>
import formatters from "../../mixins/formatters";

const allowedTags = [
  "local_current",
  "local_classic",
  "heavy_rotation",
  "light_rotation",
]

export default {
  name: "TagList",
  props: {
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mixins: [formatters],
  computed: {
    filteredTags() {
      return this.tags?.filter(tag => allowedTags.includes(tag)).sort((a, b) => a < b ? -1 : 1);
    },
  },
  methods: {
    getCircleClass(tag) {
      let classObj = {};
      classObj[tag] = true;
      return classObj;
    }
  }
};
</script>
