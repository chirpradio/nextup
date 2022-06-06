<template>
  <article class="d-flex flex-column flex-sm-row pt-2 pb-3 border-bottom">
    <div class="flex-shrink-0">
      <AlbumArtLink :album="album" :srcSize="albumArtSrcSize" />
    </div>
    <div
      class="album-details flex-shrink-0 ms-sm-3 pt-2 px-0"
      :class="detailsClass"
    >
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
        {{ album.year }} &middot; {{ album.label }}
        <span v-if="album.disc_number">– Disc {{ album.disc_number }}</span>
      </p>
      <TagList :tags="album.current_tags" />
    </div>
    <ReviewPreview v-if="showReview" class="flex-shrink-1" :album="album" />
  </article>
</template>

<style>
@media (max-width: 576px) {
  .album-details,
  .album-details__with_preview {
    width: 100%;
  }
}

@media (min-width: 576px) {
  .album-details {
    width: 50%;
  }

  .album-details__with_preview {
    width: 33%;
  }
}
</style>

<script>
import AlbumArtLink from "./AlbumArtLink.vue";
import ArtistName from "./ArtistName.vue";
import ReviewPreview from "./ReviewPreview.vue";
import TagList from "./TagList.vue";

export default {
  components: { ArtistName, TagList, AlbumArtLink, ReviewPreview },
  props: {
    album: Object,
    albumArtSrcSize: {
      type: String,
      default: "lg",
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
    detailsClass() {
      return {
        "album-details__with_preview": this.showReview,
      };
    },
  },
};
</script>
