<template>
  <div class="d-flex flex-row flex-md-column">
    <button class="btn p-0 me-2 m-md-0" @click="toggle('recommended')">
      <font-awesome-icon icon="star" :class="recommendedClasses" />
    </button>
    <button class="btn p-0 m-0" @click="toggle('explicit')">
      <font-awesome-icon icon="ban" :class="explicitClasses" />
    </button>
  </div>
</template>

<script>
import trackMixins from "@/mixins/track";
import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";

export default {
  props: {
    album_id: Object,
    track: Object,
  },
  mixins: [trackMixins],
  computed: {
    ...mapStores(useAlbumsStore),
    explicitClasses() {
      return {
        "text-danger": this.isExplicit(this.track),
        "text-muted": !this.isExplicit(this.track),
      };
    },
    recommendedClasses() {
      return {
        "text-warning": this.isRecommended(this.track),
        "text-muted": !this.isRecommended(this.track),
      };
    },
  },
  methods: {
    toggle(tag) {
      const tags = this.track.current_tags.includes(tag) ? [] : [tag];
      this.albumsStore.updateTrackTags({
        album_id: this.album_id,
        track: this.track,
        tags,
      });
    },
  },
};
</script>
