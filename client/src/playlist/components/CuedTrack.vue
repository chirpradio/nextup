<template>
  <div v-if="cuedTrack">
    <h4>Cued</h4>
    <PlaylistTrack
      :track="cuedTrack"
      v-model:notes="cuedTrack.notes"
      :editable="true"
    />
    <div class="d-flex d-flex-row justify-content-end g-2 mt-2">
      <button class="btn btn-light" @click="clear">
        <font-awesome-icon icon="xmark" />
        clear cued track
      </button>
      <LoadingButton
        class="ms-2"
        icon="play"
        label="add to playlist"
        :loading="adding"
        @click="addToPlaylist"
      />
    </div>
  </div>
</template>

<script>
import PlaylistTrack from "./PlaylistTrack.vue";
import { mapStores } from "pinia";
import { usePlaylistStore } from "../store";
import LoadingButton from "@/components/LoadingButton.vue";

export default {
  components: { PlaylistTrack, LoadingButton },
  data() {
    return {
      adding: false,
    };
  },
  computed: {
    ...mapStores(usePlaylistStore),
    cuedTrack() {
      return this.playlistStore.cuedTrack;
    },
  },
  methods: {
    async addToPlaylist() {
      this.adding = true;

      const cued = this.cuedTrack;
      if (cued.track.__key) {
        await this.playlistStore.addPlaylistTrack({
          album: cued.album.__key.path,
          artist: cued.artist.__key.path,
          categories: cued.categories || [],
          label: cued.album.label || null,
          track: cued.track.__key.path,
          notes: cued.notes,
        });
      } else {
        await this.playlistStore.addFreeformPlaylistTrack({
          album: cued.album,
          artist: cued.artist,
          categories: cued.categories || [],
          notes: cued.notes,
          track: cued.track,
        });
      }
      this.adding = false;
      this.clear();
    },
    clear() {
      this.playlistStore.clearCuedTrack();
    },
  },
};
</script>
