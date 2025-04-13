<template>
  <div v-if="cuedTrack">
    <h4>Cued</h4>
    <PlaylistTrack
      v-if="!editing"
      :track="cuedTrack"
      v-model:notes="cuedTrack.notes"
      :editable="true"
    />
    <CustomTrackForm v-if="editing" :track="cuedTrack" @change="onChange" />
    <div class="d-flex d-flex-row justify-content-end g-2 mt-2">
      <button class="btn btn-light" v-if="!editing" @click="clear">
        <font-awesome-icon icon="xmark" />
        clear cued track
      </button>
      <button class="btn btn-light" @click="edit">
        <font-awesome-icon :icon="editIcon" />
        {{ editLabel }}
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
import { usePlaylistStore } from "../playlistStore";
import LoadingButton from "@/components/LoadingButton.vue";
import CustomTrackForm from "../../components/CustomTrackForm.vue";
import playlistMixins from "../mixins";

export default {
  components: { PlaylistTrack, LoadingButton, CustomTrackForm },
  data() {
    return {
      adding: false,
      editing: false,
    };
  },
  computed: {
    ...mapStores(usePlaylistStore),
    cuedTrack() {
      return this.playlistStore.cuedTrack;
    },
    editLabel() {
      return this.editing ? "finish editing" : "edit cued track";
    },
    editIcon() {
      return this.editing ? "check" : "edit";
    },
  },
  mixins: [playlistMixins],
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
    edit() {
      this.editing = !this.editing;
    },
    onChange(item) {
      const track = this.convertCrateItemToFreeformTrack(item);
      this.playlistStore.cue(track);
    },
    clear() {
      this.playlistStore.clearCuedTrack();
    },
  },
};
</script>
