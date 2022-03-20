<template>
  <div>
    <div class="row g-2 mb-3 border-bottom">
      <div class="col-auto col-lg-2">
        <LoadingButton
          icon="rotate-right"
          label="Update"
          :outline="true"
          :loading="loading"
          @click="update"
        />
      </div>
      <div class="col col-lg-3">
        <LoadingButton class="me-2" icon="play" label="Add track" />
        <LoadingButton
          icon="plus"
          label="Add break"
          :loading="adding"
          @click="addBreak"
        />
      </div>
      <TagTotals class="col-12 col-lg-7 text-lg-end" />
    </div>
    <ol class="list-group list-group-flush list-unstyled">
      <li v-for="event in sorted" :key="event.id">
        <component :is="getComponent(event)" :track="event" class="py-2" />
      </li>
    </ol>
  </div>
</template>

<script>
import LoadingButton from "../../components/LoadingButton.vue";
import PlaylistBreak from "../../components/playlist/PlaylistBreak.vue";
import PlaylistTrack from "../../components/playlist/PlaylistTrack.vue";
import TagTotals from "../../components/playlist/TagTotals.vue";
import updateTitle from "../../mixins/updateTitle";

export default {
  components: {
    LoadingButton,
    PlaylistBreak,
    PlaylistTrack,
    TagTotals,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    adding() {
      return this.$store.getters.adding;
    },
    events() {
      return this.$store.getters.events;
    },
    lastUpdated() {
      return this.$store.getters.lastUpdated;
    },
    sorted() {
      const copy = [...this.events];
      return copy.sort((a, b) => {
        if (a.established < b.established) {
          return 1;
        }

        return -1;
      });
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
      await this.$store.dispatch("getPlaylistEvents", {
        start: this.lastUpdated,
      });
      this.loading = false;
    },
    addBreak() {
      this.$store.dispatch("addBreak");
    },
  },
};
</script>
