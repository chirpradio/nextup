<template>
  <div>
    <div class="row mb-2">
      <div class="col-12 d-flex text-end">
        <span class="font-sans me-2">ON AIR</span>
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            v-model="onAir"
          />
        </div>
      </div>
    </div>
    <div class="row g-2 mb-2">
      <LoadingButton
        class="col h-50 me-1"
        icon="rotate-right"
        label="Update"
        :outline="true"
        :loading="loading"
        @click="update"
      />
      <LoadingButton
        class="col h-50 me-1"
        :class="addButtonClasses"
        icon="play"
        label="Add track"
        @click="addTrack"
      />
      <LoadingButton
        class="col h-50"
        :class="addButtonClasses"
        icon="plus"
        label="Add break"
        :loading="adding"
        @click="addBreak"
      />
      <TagTotals class="col-12 col-lg-6 text-lg-end" />
    </div>
    <ol class="list-group list-group-flush list-unstyled border-top">
      <li v-for="event in sorted" :key="event.id">
        <component :is="getComponent(event)" :track="event" class="py-2" />
      </li>
    </ol>

    <AddTrackModal ref="addTrackModal" />
  </div>
</template>

<style>
.on-air__label {
  font-size: 0.875rem;
}
</style>

<script>
import AddTrackModal from "../../components/playlist/AddTrackModal.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import PlaylistBreak from "../../components/playlist/PlaylistBreak.vue";
import PlaylistTrack from "../../components/playlist/PlaylistTrack.vue";
import TagTotals from "../../components/playlist/TagTotals.vue";
import updateTitle from "../../mixins/updateTitle";
import { mapStores } from "pinia";
import { usePlaylistStore } from "../../stores/playlist";

export default {
  components: {
    AddTrackModal,
    LoadingButton,
    PlaylistBreak,
    PlaylistTrack,
    TagTotals,
  },
  data() {
    return {
      adding: false,
      loading: false,
    };
  },
  computed: {
    ...mapStores(usePlaylistStore),
    addButtonClasses() {
      return this.playlistStore.onAir ? { visible: true } : { invisible: true };
    },
    events() {
      return this.playlistStore.events;
    },
    lastUpdated() {
      return this.playlistStore.lastUpdated;
    },
    onAir: {
      get() {
        return this.playlistStore.onAir;
      },
      set(value) {
        this.playlistStore.onAir = value;
      },
    },
    sorted() {
      const copy = [...this.events];
      return copy.sort((a, b) => (a.established < b.established ? 1 : -1));
    },
  },
  mixins: [updateTitle],
  created: async function () {
    this.updateTitle("Playlist");
    if (this.events.length === 0) {
      this.update();
    }
  },
  methods: {
    getComponent(event) {
      if (event.class.includes("PlaylistBreak")) {
        return "PlaylistBreak";
      } else if (event.class.includes("PlaylistTrack")) {
        return "PlaylistTrack";
      }
    },
    async update() {
      this.loading = true;
      await this.playlistStore.getPlaylistEvents({
        start: this.playlistStore.lastUpdated,
      });
      this.loading = false;
    },
    async addBreak() {
      this.adding = true;
      await this.playlistStore.addBreak();
      this.adding = false;
    },
    addTrack() {
      this.$refs.addTrackModal.show();
    },
  },
};
</script>
