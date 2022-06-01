<template>
  <tr>
    <td @click="togglePlays">
      <div class="open-button">
        <span v-if="open">▾</span>
        <span v-if="!open">▸</span>
      </div>
    </td>
    <td scope="row me-2">{{ index + 1 }}.</td>
    <td>
      <ArtistName :album="play.album" />
    </td>
    <td><AlbumTitleLink class="col" :album="play.album" /></td>
    <td>{{ play.album.label }}</td>
    <td>{{ play.plays.length }}</td>
    <td><TagList :tags="play.album.current_tags" /></td>
  </tr>
  <tr v-if="open">
    <td></td>
    <td></td>
    <td colspan="6">
      <table class="table table-sm table-borderless table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Track</th>
            <th>DJ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in play.plays" :key="p.id">
            <td>{{ getPlayDate(p) }}</td>
            <td>{{ getTrackTitle(p) }}</td>
            <td>{{ getDJName(p) }}</td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>

<style scoped>
.open-button {
  cursor: pointer;
  color: var(--dark-red);
}

.open-button:hover {
  color: var(--bright-red);
}
</style>

<script>
import AlbumTitleLink from "../music/AlbumTitleLink";
import ArtistName from "../music/ArtistName.vue";
import TagList from "../music/TagList";

export default {
  name: "RotationPlayRow",
  components: { AlbumTitleLink, ArtistName, TagList },
  data() {
    return {
      open: false,
    };
  },
  props: {
    play: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  methods: {
    getPlayDate(play) {
      const d = new Date(play.established);
      return d.toLocaleString("en-us");
    },
    getTrackTitle(play) {
      return play.track ? play.track.title : play.freeform_track_title;
    },
    getDJName(play) {
      return (
        play.selector.dj_name ||
        `${play.selector.first_name} ${play.selector.last_name}`
      );
    },
    togglePlays() {
      this.open = !this.open;
    },
  },
};
</script>
