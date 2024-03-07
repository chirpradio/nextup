<template>
  <div class="pb-3">
    <h1 v-if="heading">
      <router-link v-if="seeAllLink" :to="seeAllLink">
        {{ heading }}
      </router-link>
    </h1>
    <div class="px-2">
      <AlbumCard
        class="mb-3"
        v-for="album in sortedAlbums"
        :key="album.album_id"
        :album="album"
        :hideArtistLink="hideArtistLinks"
        :showReview="showReview"
        :showEditTags="true"
      />
      <button
        v-if="more && !loading"
        type="button"
        class="btn btn-lg btn-chirp-red mt-2"
        @click="getMore"
      >
        show more albums
      </button>
      <RecordSpinner v-if="loading" />
    </div>
  </div>
</template>

<script>
import AlbumCard from "./AlbumCard.vue";
import RecordSpinner from "../RecordSpinner.vue";
import { get, shuffle, sortBy } from "lodash";

function compareByProperty(array, prop) {
  return sortBy(array, [
    function (album) {
      const value = get(album, prop);
      return typeof value === "string" ? value.toLowerCase() : null;
    },
  ]);
}

export default {
  components: {
    AlbumCard,
    RecordSpinner,
  },
  props: {
    albums: Array,
    heading: String,
    hideArtistLinks: Boolean,
    loading: Boolean,
    limit: Number,
    more: Boolean,
    sortBy: [String, Array],
    seeAllLink: Object,
    showReview: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    // when navigating between tabs, lets make sure we always start at the top of the page
    window.scrollTo(0, 0);
  },
  computed: {
    sortedAlbums() {
      if (!this.sortBy && !this.limit) {
        return this.albums;
      }

      let sorted = [...this.albums];
      if (this.sortBy && this.sortBy === "shuffle") {
        sorted = shuffle(sorted);
      } else if (this.sortBy && typeof this.sortBy === "string") {
        sorted = compareByProperty(sorted, this.sortBy);
      }

      if (this.limit) {
        return sorted.slice(0, this.limit);
      } else {
        return sorted;
      }
    },
  },
  methods: {
    getMore() {
      this.$emit("more");
    },
  },
};
</script>
