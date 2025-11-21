<template>
  <div>
    <RecordSpinner v-if="loading" />
    <div v-if="!loading">
      <h1 class="mb-3">{{ artist.name }}</h1>
      <AddToCrate :keyToAdd="artist.__key" class="col-4 col-md-3 mb-3" />
      <AlbumCollection
        :albums="albums"
        heading="Albums"
        sortBy="year"
        :hideArtistLinks="true"
      />
      <AlbumCollection
        heading="Appears On"
        :albums="appearsOn"
        sortBy="year"
        :hideArtistLinks="true"
      />
    </div>
  </div>
</template>

<script>
import AddToCrate from "@/components/AddToCrate.vue";
import RecordSpinner from "@/components/RecordSpinner.vue";
import AlbumCollection from "@/components/music/AlbumCollection.vue";
import updateTitle from "@/mixins/updateTitle";
import { mapStores } from "pinia";
import { useArtistsStore } from "@/stores/artists";

export default {
  components: { AddToCrate, AlbumCollection, RecordSpinner },
  data() {
    return {
      loading: true,
    };
  },
  props: {
    id: String,
  },
  computed: {
    ...mapStores(useArtistsStore),
    artist() {
      return this.artistsStore.artist(this.id);
    },
    albums() {
      return this.artistsStore.artistAlbums(this.id);
    },
    appearsOn() {
      return this.artistsStore.artistAppearsOn(this.id);
    },
  },
  created() {
    this.getArtist();
  },
  mixins: [updateTitle],
  methods: {
    async getArtist() {
      this.loading = true;
      await this.artistsStore.getArtist(this.id);
      await this.artistsStore.getArtistAlbums(this.id);
      this.loading = false;
      this.updateTitle(this.artist.name);
    },
  },
};
</script>
