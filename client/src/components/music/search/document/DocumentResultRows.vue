<template>
  <div>
    <div
      v-for="hit in results.hits"
      :key="hit._id"
      class="row border-top py-2 mx-0"
    >
      <div class="col-md-1 search-result__col no-overflow">
        <AlbumArtLink :album="hit._source.subject" srcSize="med" />
      </div>
      <div class="col-md-2 search-result__col">
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
      <div class="col-md-3 search-result__col">
        <AlbumTitleLink :album="hit._source.subject" />
      </div>
      <div v-if="hit.highlight" class="col-md-6 search-result__col">
        <ul v-if="hit.highlight['unsafe_text']" class="list-unstyled">
          <li
            v-for="fragment in hit.highlight['unsafe_text']"
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
import AlbumArtLink from "../../AlbumArtLink.vue";
import AlbumTitleLink from "../../AlbumTitleLink.vue";
import ArtistLink from "../../ArtistLink.vue";

const startsWithCapital = new RegExp("^[A-Z]");
const endsWithSentenceBoundary = new RegExp("[.!?]$");

export default {
  name: "DocumentResultRows",
  components: { AlbumArtLink, AlbumTitleLink, ArtistLink },
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
