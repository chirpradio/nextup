<template>
  <div>
    <div
      v-for="hit in results.hits"
      :key="hit._id"
      class="row border-top py-2 mx-0"
    >
      <div class="col-sm-1 search_result__col no_overflow">
        <AlbumArtLink :album="hit._source.album" srcSize="med" />
      </div>
      <div class="col-sm-2 search_result__col">
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
      <div class="col-sm-2 search_result__col">
        <AlbumTitleLink :album="hit._source.album" />
        <TagList :tags="hit._source.album.current_tags" />
      </div>
      <div class="col-sm-3 search_result__col d-flex align-items-stretch">
        <TrackTag :track="hit._source" class="pe-1" />
        <span>{{ hit._source.title }}</span>
      </div>
      <div class="col-sm-1 search_result__col text-sm-end numeral">
        <TrackDuration :track="hit._source" />
      </div>
      <div class="col-sm-3 search_result__col d-flex flex-column flex-xl-row">
        <AddToCrate :keyToAdd="hit._source.__key" />
        <PlayButton
          :album="hit._source.album"
          :categories="hit._source.album.current_tags"
          :track="hit._source"
          class="mt-2 mt-xl-0"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AlbumArtLink from "../../AlbumArtLink";
import AlbumTitleLink from "../../AlbumTitleLink";
import ArtistLink from "../../ArtistLink";
import TagList from "../../TagList";
import TrackDuration from "../../TrackDuration";
import AddToCrate from "../../../AddToCrate";
import TrackTag from "../../TrackTag";
import PlayButton from "../../PlayButton";

export default {
  name: "TrackResultRows",
  components: {
    AddToCrate,
    AlbumArtLink,
    AlbumTitleLink,
    ArtistLink,
    TagList,
    TrackDuration,
    TrackTag,
    PlayButton,
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
