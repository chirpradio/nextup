<template>
  <div class="pb-5">
    <div class="row pe-3">
      <div class="col-12 col-md-8">
        <!-- on air switch -->
        <div class="d-flex mb-2">
          <div class="flex-fill d-inline-flex">
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
        <!-- buttons and tag totals -->
        <div :id="PLAYLIST" class="row g-2 mb-2">
          <LoadingButton
            class="col h-md-50 me-1"
            icon="rotate-right"
            label="update"
            :outline="true"
            :loading="loading"
            @click="update"
          />
          <LoadingButton
            class="col h-md-50 me-1"
            :class="addButtonClasses"
            icon="play"
            label="add track"
            @click="addTrack"
          />
          <LoadingButton
            class="col h-md-50"
            :class="addButtonClasses"
            icon="plus"
            label="add break"
            :loading="adding"
            @click="addBreak"
          />
          <TagTotals
            class="col-12 col-xl-6 ms-0 ms-md-2 mt-3 mb-2 text-lg-end"
          />
        </div>
        <!-- playlist events -->
        <ol class="list-group list-group-flush list-unstyled border-top">
          <li v-for="event in sorted" :key="event.id">
            <component
              :is="getComponent(event)"
              :track="event"
              class="py-2"
              @selected="updateSelected"
            />
          </li>
        </ol>
      </div>
      <div
        :id="TRAFFIC_LOG"
        ref="trafficLog"
        class="col-12 col-md-4 py-3 pe-3 text-bg-light"
      >
        <TrafficLog v-if="onAir" />
      </div>
    </div>

    <!-- bottom nav for small viewports -->
    <nav
      v-if="onAir"
      class="nav nav-underline nav-fill fixed-bottom d-md-none text-bg-dark"
    >
      <a
        class="nav-link link-light"
        :class="{ active: sectionInView === PLAYLIST }"
        :href="`#${PLAYLIST}`"
        >Playlist</a
      >
      <a
        class="nav-link link-light"
        :class="{ active: sectionInView === TRAFFIC_LOG }"
        :href="`#${TRAFFIC_LOG}`"
        >Traffic Log</a
      >
    </nav>

    <AddTrackModal ref="addTrackModal" />
    <AlbumPreview
      id="albumPreview"
      class="drawer"
      :album_id="selectedAlbumId"
    />
  </div>
</template>

<script>
import AddTrackModal from "../components/AddTrackModal.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import PlaylistBreak from "../components/PlaylistBreak.vue";
import PlaylistTrack from "../components/PlaylistTrack.vue";
import TagTotals from "../components/TagTotals.vue";
import updateTitle from "@/mixins/updateTitle";
import { mapStores } from "pinia";
import { usePlaylistStore } from "../store";
import TrafficLog from "../components/TrafficLog.vue";
import AlbumPreview from "../components/AlbumPreview.vue";
import { debounce } from "lodash";

const PLAYLIST = "playlist";
const TRAFFIC_LOG = "traffic-log";

export default {
  components: {
    AddTrackModal,
    LoadingButton,
    PlaylistBreak,
    PlaylistTrack,
    TagTotals,
    TrafficLog,
    AlbumPreview,
  },
  data() {
    return {
      adding: false,
      loading: false,
      PLAYLIST,
      sectionInView: PLAYLIST,
      selectedAlbumId: null,
      TRAFFIC_LOG,
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
    this.playlistStore.pollRotationPlays();
  },
  mounted() {
    this.debounceUpdateSectionInView = debounce(this.updateSectionInView, 100);
    window.addEventListener("scroll", this.debounceUpdateSectionInView);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.debounceUpdateSectionInView);
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
    updateSelected(evt) {
      this.selectedAlbumId = evt.album_id.value;
    },
    updateSectionInView() {
      const rect = this.$refs.trafficLog.getBoundingClientRect();
      if (window.scrollY > rect.top + 2) {
        this.sectionInView = TRAFFIC_LOG;
      } else {
        this.sectionInView = PLAYLIST;
      }
    },
  },
};
</script>
