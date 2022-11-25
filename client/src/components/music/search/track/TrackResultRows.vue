<template>
  <div>
    <div
      v-for="hit in results.hits"
      :key="hit._id"
      class="row border-top py-2 mx-0"
    >
      <div class="col-md-1 search-result__col no-overflow">
        <AlbumArtLink :album="hit._source.album" srcSize="med" />
      </div>
      <div class="col-md-2 search-result__col">
        <div
          v-if="hit._source.album.is_compilation && hit._source.track_artist"
        >
          {{ hit._source.track_artist.name }}
        </div>
        <ArtistLink
          v-if="!hit._source.album.is_compilation"
          :artist="hit._source.album.album_artist"
        />
      </div>
      <div class="col-md-2 search-result__col">
        <AlbumTitleLink :album="hit._source.album" />
        <TagList :tags="hit._source.album.current_tags" class="mt-1" />
      </div>
      <div class="col search-result__col d-flex align-items-stretch">
        <TrackTag
          :track="hit._source"
          :display-when-small="false"
          class="pe-2"
          transform="down-3"
        />
        <span>{{ hit._source.title }}</span>
      </div>
      <div class="col-md-1 search-result__col text-md-end numeral">
        <TrackDuration :track="hit._source" />
      </div>
      <div class="col-auto search-result__col actions d-flex mt-2 mt-md-0">
        <TrackResultActions :track="hit._source" :album="hit._source.album" />
      </div>
      <div class="col-md-1"></div>
    </div>
  </div>
</template>

<style scoped>
.actions {
  height: fit-content;
}
</style>

<script>
import AlbumArtLink from "../../AlbumArtLink.vue";
import AlbumTitleLink from "../../AlbumTitleLink.vue";
import ArtistLink from "../../ArtistLink.vue";
import TagList from "../../TagList.vue";
import TrackDuration from "../../TrackDuration.vue";
import TrackTag from "../../TrackTag.vue";
import TrackResultActions from "./TrackResultActions.vue";

export default {
  name: "TrackResultRows",
  components: {
    AlbumArtLink,
    AlbumTitleLink,
    ArtistLink,
    TagList,
    TrackDuration,
    TrackTag,
    TrackResultActions,
  },
  props: {
    results: {
      type: Object,
      default() {
        return {
          hits: [],
          count: undefined,
        };
      },
    },
  },
};
</script>
