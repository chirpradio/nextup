<template>
  <div>
    <div
      v-for="hit in results.hits"
      :key="hit._id"
      class="row border-top py-2 mx-0"
    >
      <div class="col-sm-1 search_result__col no_overflow">
        <AlbumArtLink :album="hit._source" srcSize="med" />
      </div>
      <div class="col-sm-3 search_result__col">
        <div v-if="hit._source.is_compilation" class="badge bg-secondary">
          Compilation
        </div>
        <ArtistLink
          v-if="!hit._source.is_compilation"
          :artist="hit._source.album_artist"
        />
      </div>
      <div class="col-sm-3 search_result__col">
        <AlbumTitleLink :album="hit._source" />
        <TagList :tags="hit._source.current_tags" />
      </div>
      <div class="col-sm-3 search_result__col">{{ hit._source.label }}</div>
      <div class="col-sm-1 search_result__col">{{ hit._source.year }}</div>
      <div class="col-sm-1 search_result__col">
        <AddToCrate :keyToAdd="hit._source.__key" />
      </div>
    </div>
  </div>
</template>

<script>
import AddToCrate from "../../../AddToCrate";
import AlbumArtLink from "../../AlbumArtLink";
import AlbumTitleLink from "../../AlbumTitleLink";
import ArtistLink from "../../ArtistLink";
import TagList from "../../TagList";

export default {
  name: "AlbumResultRows",
  components: { AddToCrate, AlbumArtLink, AlbumTitleLink, ArtistLink, TagList },
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
