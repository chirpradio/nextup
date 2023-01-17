<template>
  <ul class="list-inline">
    <li v-for="tag in filteredTags" :key="tag" class="list-inline-item" :class="classes">
      <Tag :tag="tag" />
    </li>
    <EditTagsButton v-if="album" :currentTags="filteredTags" :album="album" />
  </ul>
</template>

<script>
import Tag from "./TagBadge.vue";
import EditTagsButton from './EditTagsButton.vue'

const allowedTags = [
  "local_current",
  "local_classic",
  "heavy_rotation",
  "light_rotation",
];

export default {
  name: "TagList",
  components: { Tag, EditTagsButton },
  props: {
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
    album: Object,
  },
  computed: {
    classes() {
      return {
        "d-none": this.filteredTags.length === 0,
      };
    },
    filteredTags() {
      if (!this.tags) {
        return [];
      }

      return this.tags
        .filter((tag) => allowedTags.includes(tag))
        .sort((a, b) => (a < b ? -1 : 1));
    },
  },
};
</script>
