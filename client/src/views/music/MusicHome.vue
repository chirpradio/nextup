<template>
  <div class="container-fluid">
    <form
      id="search"
      class="row row-cols-lg-auto pt-3 px-1 mb-3 border align-items-center"
      v-on:submit.prevent="search"
    >
      <div class="flex-grow-1 mb-3">
        <label class="visually-hidden" for="search">Search</label>
        <input
          class="form-control"
          id="search"
          v-model="term"
          name="term"
          type="search"
          placeholder="search the entire music library"
          aria-label="search"
        />
      </div>
      <div class="col-auto mb-3">
        <button class="btn btn-chirp-red" type="submit">Search</button>
        <span class="mx-2">or</span>
        <router-link
          to="/library/search"
          class="btn btn-outline-dark"
          @click="sendRandomizeEvent"
        >
          Randomize
        </router-link>
      </div>
    </form>

    <div class="row">
      <AlbumCollection
        class="col-12 col-md-6 mb-4"
        heading="Heavy Rotation ›"
        :albums="albumsStore.taggedAlbums('heavy_rotation')"
        :loading="albumsStore.loadingTaggedAlbums('heavy_rotation')"
        :limit="4"
        tag="heavy_rotation"
        sortBy="shuffle"
        :seeAllLink="{ name: 'tag', params: { tag: 'heavy_rotation' } }"
      />
      <AlbumCollection
        class="col-12 col-md-6 mb-4"
        heading="Light Rotation ›"
        :albums="albumsStore.taggedAlbums('light_rotation')"
        :loading="albumsStore.loadingTaggedAlbums('light_rotation')"
        :limit="4"
        tag="light_rotation"
        sortBy="shuffle"
        :seeAllLink="{ name: 'tag', params: { tag: 'light_rotation' } }"
      />
      <AlbumCollection
        class="col-12 col-md-6"
        heading="Library Adds ›"
        :albums="albumsStore.libraryAdds"
        :loading="albumsStore.loadingRecentAlbums"
        :limit="4"
        sortBy="shuffle"
        :seeAllLink="{ name: 'LibraryAdds' }"
      />
    </div>
  </div>
</template>

<script>
import AlbumCollection from "@/components/music/AlbumCollection.vue";
import updateTitle from "@/mixins/updateTitle";
import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";

export default {
  name: "MusicHome",
  components: {
    AlbumCollection,
  },
  data() {
    return {
      term: "",
    };
  },
  computed: {
    ...mapStores(useAlbumsStore),
  },
  mounted() {
    this.albumsStore.getTaggedAlbums({ tag: "heavy_rotation" });
    this.albumsStore.getTaggedAlbums({ tag: "light_rotation" });
    this.albumsStore.getRecentAlbums();
    this.updateTitle("Library");
  },
  mixins: [updateTitle],
  methods: {
    search() {
      this.$gtag.event("Search", {
        event_category: "Library",
        event_label: "Search – Hero",
      });
      this.$router.push({
        name: "SearchEverything",
        query: { term: this.term },
      });
    },
    sendRandomizeEvent() {
      this.$gtag.event("Search", {
        event_category: "Library",
        event_label: "Randomize",
      });
    },
  },
};
</script>
