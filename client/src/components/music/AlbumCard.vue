<template>
  <div class="card col-md-3 pt-2 border-light">
    <AlbumArtLink :album="album" class="card-img-top" imgSize="lg" />
    <div class="card-body pt-2 pb-4 px-0">
      <h3 class="card-title">
        <router-link
          :to="{ name: 'album', params: { id: album.album_id.value } }"
        >
          {{ album.title }}
        </router-link>
      </h3>
      <h4 v-if="!hideArtistLink" class="card-subtitle">
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
      </h4>
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
    hideArtistLink: Boolean,
  },
};
</script>
