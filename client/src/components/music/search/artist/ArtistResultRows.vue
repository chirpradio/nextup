<template>
  <div>
    <div
      v-for="hit in results.hits"
      :key="hit._id"
      class="row border-top py-2 mx-0"
    >
      <div class="col search-result__col">
        <ArtistLink :artist="hit._source" />
      </div>
    </div>
  </div>
</template>

<script>
import ArtistLink from "../../ArtistLink.vue";

export default {
  name: "ArtistResultRows",
  components: { ArtistLink },
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
