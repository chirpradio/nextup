<template>
  <article
    class="d-flex flex-column flex-sm-row pt-2 pb-3"
    :class="containerClass"
  >
    <div>
      <AlbumArtLink :album="album" :srcSize="albumArtSrcSize" />
    </div>
    <div class="album-details ms-sm-4 pt-2 px-0" :class="detailsClass">
      <component :is="firstHeading">
        <router-link
          v-if="linkToAlbum"
          :to="{ name: 'album', params: { id: album.album_id.value } }"
        >
          {{ album.title }}
        </router-link>
        <span v-if="!linkToAlbum">{{ album.title }}</span>
      </component>
      <component :is="secondHeading" v-if="!hideArtistLink">
        <ArtistName :album="album" :includeBy="true" />
      </component>
      <p class="my-2">
        {{ album.label }} &middot; {{ album.year }}
        <span v-if="album.disc_number">– Disc {{ album.disc_number }}</span>
      </p>
      <div v-if="album.pronunciation" class="text-muted">
        <i
          >Pronunciation: <br />
          {{ album.pronunciation }}</i
        >
      </div>
      <TagList :tags="album.current_tags" :album="album" />
      <RecentlyPlayedAlert :album="album" />
    </div>
    <ReviewPreview v-if="showReview" class="w-100" :album="album" />
  </article>
</template>

<script>
import AlbumArtLink from "./AlbumArtLink.vue";
import ArtistName from "./ArtistName.vue";
import ReviewPreview from "./ReviewPreview.vue";
import TagList from "./TagList.vue";
import RecentlyPlayedAlert from "./RecentlyPlayedAlert.vue";

export default {
  components: {
    ArtistName,
    TagList,
    AlbumArtLink,
    ReviewPreview,
    RecentlyPlayedAlert,
  },
  props: {
    album: Object,
    albumArtSrcSize: {
      type: String,
      default: "lg",
    },
    border: {
      type: Boolean,
      default: true,
    },
    firstHeadingLevel: {
      type: Number,
      default: 2,
    },
    hideArtistLink: Boolean,
    linkToAlbum: {
      type: Boolean,
      default: true,
    },
    showReview: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    firstHeading() {
      return `h${this.firstHeadingLevel}`;
    },
    secondHeading() {
      return `h${this.firstHeadingLevel + 1}`;
    },
    containerClass() {
      return {
        "border-bottom": this.border,
      };
    },
    detailsClass() {
      return {
        "w-50": this.showReview,
        "w-100": !this.showReview,
      };
    },
  },
};
</script>
