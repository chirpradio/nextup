<template>
  <div>
    <div
      v-for="hit in results.hits"
      :key="hit._id"
      class="row border-top py-2 mx-0"
    >
      <div class="col-sm-1 search_result__col">
        <AlbumArt :album="hit._source.subject" size="med" />
      </div>
      <div class="col-sm-3 search_result__col">
        <div
          v-if="hit._source.subject.is_compilation"
          class="badge bg-secondary"
        >
          Compilation
        </div>
        <ArtistLink
          v-if="!hit._source.subject.is_compilation"
          :artist="hit._source.subject.album_artist"
        />
      </div>
      <div class="col-sm-3 search_result__col">
        <AlbumTitleLink :album="hit._source.subject" />
      </div>
      <div v-if="hit.highlight" class="col-sm-5 search_result__col">
        <ul
          v-if="hit.highlight['unsafe_text.normalized']"
          class="list-unstyled"
        >
          <li
            v-for="fragment in hit.highlight['unsafe_text.normalized']"
            :key="fragment"
            class="mb-1 text-muted whitespace-initial"
          >
            <span v-html="addEllipses(fragment)"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.whitespace-initial {
  white-space: initial;
}
</style>

<script>
import AlbumArt from "../../AlbumArt";
import AlbumTitleLink from "../../AlbumTitleLink";
import ArtistLink from "../../ArtistLink";

const startsWithCapital = new RegExp("^[A-Z]");
const endsWithSentenceBoundary = new RegExp("[.!?]$");

export default {
  name: "DocumentResultRows",
  components: { AlbumArt, AlbumTitleLink, ArtistLink },
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
  methods: {
    addEllipses: function (fragment) {
      if (!startsWithCapital.test(fragment)) {
        fragment = `...${fragment}`;
      }

      if (!endsWithSentenceBoundary.test(fragment)) {
        fragment = `${fragment}...`;
      }

      return fragment;
    },
  },
};
</script>
