<template>
  <ul class="list-inline">
    <li v-for="tag in tags" :key="tag" class="list-inline-item badge badge-secondary">{{formatTag(tag)}}</li>
  </ul>
</template>

<script>
import formatters from "../../mixins/formatters";

export default {
  name: "TagList",
  props: {
    tags: {
      type: Array,
      default: [],
    }
  },
  mixins: [formatters],
}
</script>