<template>
  <div class="d-flex flex-column align-items-end">
    <Tag :tag="tag" :badge="false" class="mb-1" />
    <span class="font-sans">{{ total }} / {{ expected }}</span>
  </div>
</template>

<script>
import Tag from "@/components/music/TagBadge.vue";

export default {
  components: { Tag },
  props: {
    tag: String,
    total: Number,
    expected: Number,
  },
};
</script>
