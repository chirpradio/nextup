<template>
  <div>
    <RecordSpinner v-if="loading" />
    <div class="px-6" v-if="!loading">
      <div class="row mb-3">
        <div class="col-md-2">
          <AlbumArt :album="album" imgSize="fluid" srcSize="lg" /> 
        </div>
        <div class="col-md-10">
          <h1>{{album.title}}</h1>
          <h2>
            <span v-if="album.is_compilation" class="badge badge-info">Compilation</span>
            <span v-if="!album.is_compilation">by <ArtistLink :artist="album.album_artist" /></span>
          </h2> 
          <p>{{album.year}} – {{album.label}} <span v-if="album.disc_number"> – Disc {{album.disc_number}}</span></p>
          <TagList :tags="album.current_tags" />          
          <AddToCrate :keyToAdd="album.key" />
        </div>
      </div>

      <figure v-for="review in album.reviews" :key="review.id" class="row col-xl-9 py-3">
        <blockquote class="blockquote">
          <p class="mb-0" v-html="review.unsafe_text"></p>
        </blockquote>
        <figcaption v-if="review.author" class="blockquote-footer">{{review.author.first_name}} {{review.author.last_name}} ({{formatDate(review.created)}})</figcaption>
      </figure>
    
      <div v-if="album.comments && album.comments.length">
        <h4>Comments</h4>
        <ul class="list-unstyled">
          <li v-for="comment in album.comments" :key="comment.id"><span v-html="comment.unsafe_text"></span> ({{comment.author.first_name}} {{comment.author.last_name}}, {{formatDate(comment.created)}})</li>
        </ul>
      </div>

      <h3>Tracks</h3>
      <div class="track_list__header row ml-2 mt-3 py-1">       
        <h6 class="col-sm-4 track_title">Title</h6>
        <h6 v-if="album.is_compilation" class="col-sm-3">Artist</h6>
        <h6 class="col-sm-1 text-right">Length</h6>
        <h6 class="col-sm-1 text-right d-none d-md-block">Bit rate</h6>
        <h6 class="col-sm-3"></h6>
      </div>
      <div class="track_list ml-4">
        <div v-for="track in album.tracks" :key="track.id" class="track_list__track row py-1 border-top">    
          <div class="col-sm-4">
            <TrackTitle :track="track" />
          </div>
          <div v-if="album.is_compilation" class="col-sm-3">
            <ArtistLink :artist="track.track_artist" />
          </div>
          <div class="col-sm-1 text-right"><TrackDuration :track="track" /></div>
          <div class="col-sm-1 text-right d-none d-md-block">{{track.bit_rate_kbps}}kbps</div>
          <div class="col-sm-3">
            <AddToCrate :keyToAdd="track.__key" :limitWidth="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.track_list {
  counter-reset: track-counter;
}
.track_list .track_list__track {
  counter-increment: track-counter;
}
.track_list__track::before {
  content: counter(track-counter) "."; 
}

.track_list__header::before {
  content: ' ';
}

.track_list__header::before,
.track_list__track::before {
  min-width: 2em;
}
</style>

<script>
import AddToCrate from '../../components/AddToCrate.vue';
import RecordSpinner from "../../components/RecordSpinner";
import ArtistLink from "../../components/music/ArtistLink";
import TagList from "../../components/music/TagList";
import AlbumArt from "../../components/music/AlbumArt";
import formatters from "../../mixins/formatters";
import TrackDuration from "../../components/music/TrackDuration";
import TrackTitle from "../../components/music/TrackTitle";

export default {
  components: { AddToCrate, RecordSpinner, ArtistLink, TagList, AlbumArt, TrackDuration, TrackTitle },
  data () {
    return {
      loading: true,
    }
  },
  props: {
    id: String,
  },
  computed: {
    album () {
      return this.$store.getters.albumById(this.id);
    },
  },
  title () {
    return this.album ? this.album.title : "";
  },
  created () {
    this.getAlbum();
  },
  mixins: [formatters],
  methods: {
    async getAlbum () {
      this.loading = true;
      await this.$store.dispatch('getAlbum', this.id);
      this.loading = false;
    },
  }  
}
</script>