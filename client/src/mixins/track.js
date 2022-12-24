export default {
  methods: {
    isExplicit(track) {
      return track?.current_tags?.includes("explicit");
    },
    isRecommended(track) {
      return track?.current_tags?.includes("recommended");
    },
  },
};
