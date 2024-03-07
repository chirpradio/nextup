<template>
  <div
    v-if="this.review"
    class="px-0 px-sm-3 py-0 py-sm-2 lead text-muted fs-6"
  >
    <span>{{ author }} writes </span>
    <span v-html="excerpt"></span>
    <router-link :to="{ name: 'album', params: { id: album.album_id.value } }">
      read more
    </router-link>
  </div>
</template>

<script>
const MAX_CHARACTERS = 500;

export default {
  props: {
    album: Object,
  },
  computed: {
    review() {
      const reviews = this.album.reviews;
      if (Array.isArray(reviews) && reviews.length > 0) {
        return reviews[0];
      }
      return undefined;
    },
    excerpt() {
      const excerpt = this.review.unsafe_text.slice(0, MAX_CHARACTERS);
      const index = excerpt.lastIndexOf(" ");
      return `“${excerpt.slice(0, index)}...”`;
    },
    author() {
      if (this.review.author_name) {
        return this.review.author_name;
      }

      if (!this.review.author) {
        return "";
      }

      return `${this.review.author.first_name} ${this.review.author.last_name}`;
    },
  },
};
</script>
