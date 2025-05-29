<template>
  <h3 class="d-none">Reviews</h3>
  <DocumentFigure
    v-for="review in album.reviews"
    :key="review.id"
    :document="review"
    class="py-3"
  />

  <h4>Comments</h4>
  <DocumentFigure
    v-for="comment in album.comments"
    :key="comment.id"
    :document="comment"
    :compact="true"
  />
  <div class="row">
    <label for="comment" class="form-label">Write a comment</label>
    <div class="col-9">      
      <MarkdownEditor v-model="comment" />
    </div>
  </div>
  <LoadingButton
    class="mt-3 mb-5"
    icon="plus"
    label="add comment"
    :loading="adding"
    :small="true"
    :disable="commentEmpty"
    @click="addComment"
  />
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
  },
  methods: {
    async addComment() {
      this.adding = true;

      try {
        await this.documentsStore.addComment({
          user: this.authStore.user,
          comment: this.comment,
          album: this.album,
        });
        this.comment = "";
      } catch (err) {
        console.error(err);
      }

      this.adding = false;
    },
  },
};
</script>
