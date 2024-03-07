<template>
  <div class="container-fluid px-0 px-md-2">
    <RecordSpinner v-if="loading" />
    <div class="row px-6" v-if="!loading">
      <div class="col-12 col-xl-6 pe-5">
        <div class="row mb-3">
          <AlbumCard
            :album="album"
            :firstHeadingLevel="1"
            :linkToAlbum="false"
            :border="false"
            albumArtSrcSize="xl"
            :showEditTags="true"
          />
        </div>
        <AddToCrate :keyToAdd="album.__key" class="col-md-4" />

        <h3 class="d-none">Reviews</h3>
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

      <div class="col col-xl-6 mt-3 mt-xl-0 bg-light bg-opacity-75">
        <h3 class="d-lg-none mt-3">Tracks</h3>
        <TrackList :album="album" class="p-1 py-lg-3 px-lg-2 me-lg-4" />
      </div>
    </div>
  </div>
</template>

<script>
import AddToCrate from "@/components/AddToCrate.vue";
import RecordSpinner from "@/components/RecordSpinner.vue";
import AlbumCard from "@/components/music/AlbumCard.vue";
import TrackList from "@/components/music/TrackList.vue";
import DocumentFigure from "../../components/music/DocumentFigure.vue";
import updateTitle from "@/mixins/updateTitle";
import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";

export default {
  components: {
    AlbumCard,
    AddToCrate,
    DocumentFigure,
    RecordSpinner,
    TrackList,
  },
  data() {
    return {
      loading: true,
    };
  },
  props: {
    id: String,
  },
  computed: {
    ...mapStores(useAlbumsStore),
    album() {
      return this.albumsStore.albumById(this.id);
    },
  },
  created() {
    this.getAlbum();
  },
  mixins: [updateTitle],
  methods: {
    async getAlbum() {
      this.loading = true;
      await this.albumsStore.getAlbum(this.id);
      this.loading = false;
      this.updateTitle(this.album.title);
    },
  },
};
</script>
