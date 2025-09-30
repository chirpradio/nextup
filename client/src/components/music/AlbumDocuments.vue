<template>
  <h3 class="d-none">Reviews</h3>
  <DocumentFigure
    v-for="review in album.reviews"
    :key="review.id"
    :document="review"
    :rows="15"
    class="py-3 pb-2 mb-2"
  />
  <div class="row mb-5">
    <div class="d-flex d-inline align-items-center" role="button">
      <button
        class="btn btn-link-chirp-red d-inline ps-0"
        @click="toggleAddReviewOpen"
      >
        <font-awesome-icon :icon="addReviewIcon" />
        write a review
      </button>
    </div>
    <div v-show="addReviewOpen">
      <label for="review" class="sr-only">review</label>
      <MarkdownEditor v-model="review" rows="12" />
      <LoadingButton
        class="mt-3 mb-5 col-3"
        icon="plus"
        label="add review"
        :loading="adding"
        :small="true"
        :disable="reviewEmpty"
        @click="addReview"
      />
    </div>
  </div>

  <h3 class="h4 mt-4">Comments</h3>
  <DocumentFigure
    v-for="comment in sortedComments"
    :key="comment.id"
    :document="comment"
    :compact="true"
    :bottomBorder="true"
  />
  <div class="row">
    <div class="d-flex d-inline align-items-center" role="button">
      <button
        class="btn btn-link-chirp-red d-inline ps-0"
        @click="toggleAddCommentOpen"
      >
        <font-awesome-icon :icon="addCommentIcon" />
        write a comment
      </button>
    </div>
    <div v-show="addCommentOpen">
      <label for="comment" class="sr-only">comment</label>
      <MarkdownEditor v-model="comment" class="ms-2" />
      <LoadingButton
        class="mt-3 mb-5 ms-2 col-3"
        icon="plus"
        label="add comment"
        :loading="adding"
        :small="true"
        :disable="commentEmpty"
        @click="addComment"
      />
    </div>
  </div>
</template>

<script>
import LoadingButton from "../LoadingButton.vue";
import DocumentFigure from "./DocumentFigure.vue";
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useDocumentsStore } from "../../stores/documents";
import MarkdownEditor from "./MarkdownEditor.vue";

export default {
  components: {
    DocumentFigure,
    LoadingButton,
    MarkdownEditor,
  },
  data() {
    return {
      adding: false,
      comment: "",
      review: "",
      addCommentOpen: false,
      addReviewOpen: false,
    };
  },
  props: {
    album: Object,
  },
  computed: {
    ...mapStores(useDocumentsStore, useAuthStore),
    commentEmpty() {
      return this.comment.length === 0;
    },
    sortedComments() {
      if (!this.album.comments || !Array.isArray(this.album.comments)) {
        return [];
      }
      return [...this.album.comments].sort((a, b) => {
        return new Date(b.created) - new Date(a.created);
      });
    },
    reviewEmpty() {
      return this.review.length === 0;
    },
    addReviewIcon() {
      return this.addReviewOpen ? "caret-down" : "caret-right";
    },
    addCommentIcon() {
      return this.addCommentOpen ? "caret-down" : "caret-right";
    },
  },
  mounted() {
    this.addReviewOpen = this.album.reviews.length === 0;
  },
  methods: {
    async addDocument(doctype, text) {
      this.adding = true;

      try {
        await this.documentsStore.addDocument({
          user: this.authStore.user,
          album: this.album,
          doctype,
          text,
        });
        this[doctype] = "";
      } catch (err) {
        console.error(err);
      }

      this.adding = false;
    },
    async addComment() {
      await this.addDocument("comment", this.comment);
    },
    async addReview() {
      await this.addDocument("review", this.review);
    },
    toggleAddReviewOpen() {
      this.addReviewOpen = !this.addReviewOpen;
    },
    toggleAddCommentOpen() {
      this.addCommentOpen = !this.addCommentOpen;
    },
  },
};
</script>
