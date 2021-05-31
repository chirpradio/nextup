<template>
  <div>
    <RecordSpinner v-if="loading" />
    <div class="px-6" v-if="!loading">
      <div class="row mb-3">
        <div class="col-md-2 mb-3">
          <AlbumArt :album="album" imgSize="fluid" srcSize="lg" />
        </div>
        <div class="col-md-10">
          <h1>{{ album.title }}</h1>
          <h2>
            <span
              v-if="album.is_compilation"
              class="badge rounded-pill bg-secondary"
            >
              Compilation
            </span>
            <span v-if="!album.is_compilation">
              by
              <ArtistLink :artist="album.album_artist" />
            </span>
          </h2>
          <p>
            {{ album.year }} · {{ album.label }}
            <span v-if="album.disc_number">· Disc {{ album.disc_number }}</span>
          </p>
          <TagList :tags="album.current_tags" />
        </div>
      </div>
      <div class="row">
        <AddToCrate :keyToAdd="album.key" class="col-md-4" />
      </div>

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
            <div class="col-12 col-md-9">
              <div class="col mb-1">
                <TrackTag :track="track" class="pe-1" />
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
import TagList from "../../components/music/TagList";
import AlbumArt from "../../components/music/AlbumArt";
import formatters from "../../mixins/formatters";
import TrackDuration from "../../components/music/TrackDuration";
import TrackTag from "../../components/music/TrackTag";

export default {
  components: {
    AddToCrate,
    RecordSpinner,
    ArtistLink,
    TagList,
    AlbumArt,
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
  title() {
    return this.album ? this.album.title : "";
  },
  created() {
    this.getAlbum();
  },
  mixins: [formatters],
  methods: {
    async getAlbum() {
      this.loading = true;
      await this.$store.dispatch("getAlbum", this.id);
      this.loading = false;
    },
  },
};
</script>
