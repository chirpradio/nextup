<template>
  <div class="d-flex flex-column flex-sm-row pt-2 border-light">
    <div class="flex-shrink-0">
      <AlbumArtLink :album="album" :srcSize="albumArtSrcSize" />
    </div>
    <div class="flex-grow-1 ms-sm-3 pt-2 px-0">
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
      </component>
      <p class="my-2">
        {{ album.year }} &middot; {{ album.label }}
        <span v-if="album.disc_number">– Disc {{ album.disc_number }}</span>
      </p>
      <TagList :tags="album.current_tags" />
    </div>
  </div>
</template>

<script>
import AlbumArtLink from "./AlbumArtLink.vue";
import ArtistLink from "./ArtistLink.vue";
import TagList from "./TagList.vue";

export default {
  components: { ArtistLink, TagList, AlbumArtLink },
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
  },
  computed: {
    firstHeading() {
      return `h${this.firstHeadingLevel}`;
    },
    secondHeading() {
      return `h${this.firstHeadingLevel + 1}`;
    },
  },
};
</script>
