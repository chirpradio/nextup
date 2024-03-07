<template>
  <ul class="list-inline">
    <li
      v-for="tag in filteredTags"
      :key="tag"
      class="list-inline-item"
      :class="classes"
    >
      <Tag :tag="tag" />
    </li>
    <EditTagsButton
      v-if="showEditTags"
      :currentTags="filteredTags"
      :album="album"
    />
  </ul>
</template>

<script>
import Tag from "./TagBadge.vue";
import EditTagsButton from "./EditTagsButton.vue";
import { mapStores } from "pinia";

import { useAuthStore } from "@/stores/auth";
import { allowedTags } from "@/constants";

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
    showEditTags: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapStores(useAuthStore),
    classes() {
      return {
        "d-none": this.filteredTags.length === 0,
      };
    },
    canEditTags() {
      return !!this.album && this.authStore.hasRole("reviewer");
    },
    filteredTags() {
      if (!this.tags) {
        return [];
      }

      return this.tags
        .filter((tag) => allowedTags.includes(tag))
        .sort((a, b) => (a < b ? -1 : 1));
    },
    showEditTagsButton() {
      return this.showEditTags && this.canEditTags;
    },
  },
};
</script>
