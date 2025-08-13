<template>
  <p v-html="render(text)"></p>
</template>

<script>
import markdownit from "markdown-it";

const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
}).disable(["heading", "image"]);

export default {
  props: {
    text: String,
  },
  methods: {
    render(text) {
      return md.render(text);
    },
  },
};
</script>
