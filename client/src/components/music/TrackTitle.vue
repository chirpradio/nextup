<template>
  <span class="track_title" :class="classObject">{{track.title}}</span>
</template>

<style>
.track_title {
  position: relative;
}

.track_title::before {
  content: " ";
  display: inline-block;
  font-size: 0.75em;
  position: relative;
  top: -2px;
  width: 1.5rem;
}

.recommended::before {
  content: "⭐️";
}

.explicit::before {
  content: "🚫";
}
</style>

<script>
export default {
  name: "TrackTitle",
  props: {
    track: Object,
  },
  computed: {
    classObject () {
      return { 
        'explicit': this.isTrackExplicit(), 
        'recommended': this.isTrackRecommended() 
      }
    }
  },
  methods: {
    isTrackExplicit () {
      return this.track && this.track.current_tags && this.track.current_tags.includes("explicit");
    },
    isTrackRecommended () {
      return this.track && this.track.current_tags && this.track.current_tags.includes("recommended");
    },
  }
}
</script>