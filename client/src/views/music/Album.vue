<template>
  <div class="container-fluid px-0 px-md-2">
    <RecordSpinner v-if="loading" />
    <div class="px-6" v-if="!loading">
      <div class="row mb-3">
        <AlbumCard :album="album" :firstHeadingLevel="1" :linkToAlbum="false" />
      </div>
      <AddToCrate :keyToAdd="album.__key" class="col-md-4" />

      <h3 class="visually-hidden">Reviews</h3>
      <figure
        v-for="review in album.reviews"
        :key="review.id"
        class="row col-xl-9 py-3"
      >
        <blockquote class="blockquote">
          <p v-html="review.unsafe_text"></p>
        </blockquote>
        <figcaption v-if="review.author" class="blockquote-footer">
          {{ review.author.first_name }} {{ review.author.last_name }} ({{
            formatDate(review.created)
          }})
        </figcaption>
      </figure>

      <div class="col-xl-9" v-if="album.comments && album.comments.length">
        <h4>Comments</h4>
        <figure v-for="comment in album.comments" :key="comment.id">
          <blockquote>
            <p v-html="comment.unsafe_text"></p>
          </blockquote>
          <figcaption v-if="comment.author" class="blockquote-footer">
            {{ comment.author.first_name }} {{ comment.author.last_name }} ({{
              formatDate(comment.created)
            }})
          </figcaption>
        </figure>
      </div>

      <h3 class="mt-3">Tracks</h3>
      <ol
        class="list-group list-group-unstyled list-group-flush col-12 col-md-9"
      >
        <li
          v-for="track in album.tracks"
          :key="track.id"
          class="list-group-item d-flex align-items-start px-1"
        >
          <div class="d-flex flex-column flex-md-row">
            <span class="track-number">{{ track.track_num }}.</span>
            <TrackTag :track="track" class="mt-1 ms-md-1" />
          </div>
          <div class="d-flex flex-fill flex-column flex-md-row ms-2">
            <div class="me-auto">
              <div class="mb-1">
                <span class="fw-bold">{{ track.title }}</span>
                <span v-if="album.is_compilation">
                  by
                  <ArtistLink :artist="track.track_artist" />
                </span>
              </div>
              <div class="col mb-1">
                <TrackDuration :track="track" />
                <small class="text-muted fw-light">
                  &middot; {{ track.bit_rate_kbps }}kbps
                </small>
              </div>
            </div>
            <AddToCrate
              :keyToAdd="track.__key"
              :limitWidth="true"
              class="flex-shrink-1 mt-md-0"
            />
            <PlayButton
              :album="album"
              :categories="album.current_tags"
              :track="track"
              class="mt-2 mt-md-0"
            />
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.track-number {
  min-width: 1.36em;
  text-align: center;
}
</style>

<script>
import AddToCrate from "../../components/AddToCrate.vue";
import RecordSpinner from "../../components/RecordSpinner";
import ArtistLink from "../../components/music/ArtistLink";
import formatters from "../../mixins/formatters";
import updateTitle from "../../mixins/updateTitle";
import TrackDuration from "../../components/music/TrackDuration";
import TrackTag from "../../components/music/TrackTag";
import PlayButton from "../../components/music/PlayButton";
import AlbumCard from "../../components/music/AlbumCard";

export default {
  components: {
    AlbumCard,
    AddToCrate,
    RecordSpinner,
    ArtistLink,
    TrackDuration,
    TrackTag,
    PlayButton,
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
    album() {
      return this.$store.getters.albumById(this.id);
    },
  },
  created() {
    this.getAlbum();
  },
  mixins: [formatters, updateTitle],
  methods: {
    async getAlbum() {
      this.loading = true;
      await this.$store.dispatch("getAlbum", this.id);
      this.loading = false;
      this.updateTitle(this.album.title);
    },
  },
};
</script>
