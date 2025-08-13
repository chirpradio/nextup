<template>
  <figure>
    <blockquote :class="blockquoteClass">
      <MarkdownRenderer :text="document.unsafe_text" />
    </blockquote>
    <figcaption
      v-if="document.author"
      class="blockquote-footer"
      :class="footerClass"
    >
      {{ document.author.first_name }} {{ document.author.last_name }} ({{
        formatDate(document.created)
      }})
    </figcaption>
    <figcaption
      v-else-if="document.author_name"
      class="blockquote-footer"
      :class="footerClass"
    >
      {{ document.author_name }} ({{ formatDate(document.created) }})
    </figcaption>
  </figure>
</template>

<script>
import formatters from "@/mixins/formatters";
import MarkdownRenderer from "./MarkdownRenderer.vue";

export default {
  props: {
    document: Object,
    compact: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MarkdownRenderer,
  },
  computed: {
    blockquoteClass() {
      return {
        blockquote: !this.compact,
      };
    },
    footerClass() {
      return {
        "mt-2": !this.compact,
      };
    },
  },
  mixins: [formatters],
};
</script>
