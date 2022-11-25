<template>
  <div class="offcanvas offcanvas-end">
    <div class="offcanvas-header">
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body pt-0">
      <RecordSpinner v-if="loading" />
      <div class="row" v-if="album">
        <div class="col-12">
          <AlbumCard
            :album="album"
            :firstHeadingLevel="1"
            :linkToAlbum="true"
            :border="false"
            albumArtSrcSize="xl"
          />

          <h3 class="visually-hidden">Reviews</h3>
          <DocumentFigure
            v-for="review in album.reviews"
            :key="review.id"
            :document="review"
            class="py-3"
          />

          <div v-if="album.comments && album.comments.length">
            <h4>Comments</h4>
            <DocumentFigure
              v-for="comment in album.comments"
              :key="comment.id"
              :document="comment"
              :compact="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Offcanvas } from "bootstrap"; // eslint-disable-line no-unused-vars
import RecordSpinner from "@/components/RecordSpinner.vue";
import AlbumCard from "@/components/music/AlbumCard.vue";
import DocumentFigure from "@/components/music/DocumentFigure.vue";
import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";

export default {
  components: { AlbumCard, DocumentFigure, RecordSpinner },
  props: {
    album_id: String,
  },
  computed: {
    ...mapStores(useAlbumsStore),
    album() {
      return this.albumsStore.albumById(this.album_id);
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  watch: {
    async album_id(newId) {
      this.loading = true;
      await this.albumsStore.getAlbum(newId);
      this.loading = false;
    },
  },
};
</script>
