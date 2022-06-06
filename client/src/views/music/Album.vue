<template>
  <div class="container-fluid">
    <RecordSpinner v-if="loading" />
    <div class="px-6" v-if="!loading">
      <div class="row mb-3">
        <AlbumCard :album="album" :firstHeadingLevel="1" :linkToAlbum="false" />
      </div>
      <div class="row">
        <AddToCrate :keyToAdd="album.__key" class="col-md-4" />
      </div>

      <h3 class="visually-hidden">Reviews</h3>
      <figure
        v-for="review in album.reviews"
        :key="review.id"
        class="row col-lg-8 py-3"
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

      <div v-if="album.comments && album.comments.length">
        <h4>Comments</h4>
        <ul class="list-unstyled">
          <li v-for="comment in album.comments" :key="comment.id">
            <span v-html="comment.unsafe_text"></span>
            ({{ comment.author.first_name }} {{ comment.author.last_name }},
            {{ formatDate(comment.created) }})
          </li>
        </ul>
      </div>

      <h3>Tracks</h3>
      <ol
        class="list-group list-group-numbered list-group-flush col-12 col-md-9"
      >
        <li
          v-for="track in album.tracks"
          :key="track.id"
          class="list-group-item d-flex align-items-start"
        >
          <div class="row ms-2 flex-fill">
            <div class="col-auto">
              <TrackTag :track="track" class="pe-1" />
            </div>
            <div class="col-12 col-md-6">
              <div class="col mb-1">
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
              class="col-12 col-md-3"
            />
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import AddToCrate from "../../components/AddToCrate.vue";
import RecordSpinner from "../../components/RecordSpinner";
import ArtistLink from "../../components/music/ArtistLink";
import formatters from "../../mixins/formatters";
import updateTitle from "../../mixins/updateTitle";
import TrackDuration from "../../components/music/TrackDuration";
import TrackTag from "../../components/music/TrackTag";
import AlbumCard from "../../components/music/AlbumCard";

export default {
  components: {
    AlbumCard,
    AddToCrate,
    RecordSpinner,
    ArtistLink,
    TrackDuration,
    TrackTag,
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
