<template>
  <ul class="list-inline" :class="classes">
    <li v-for="tag in filteredTags" :key="tag" class="list-inline-item">
      <Tag :tag="tag" />
    </li>
  </ul>
</template>

<script>
import Tag from "./Tag.vue";

const allowedTags = [
  "local_current",
  "local_classic",
  "heavy_rotation",
  "light_rotation",
];

export default {
  name: "TagList",
  components: { Tag },
  props: {
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    classes() {
      return {
        "d-none": this.filteredTags.length === 0,
      };
    },
    filteredTags() {
      return this.tags
        ?.filter((tag) => allowedTags.includes(tag))
        .sort((a, b) => (a < b ? -1 : 1));
    },
  },
};
</script>
