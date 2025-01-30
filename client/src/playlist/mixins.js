export default {
  methods: {
    convertCrateItemToFreeformTrack(item) {
      return {
        album: {
          title: item.album,
          label: item.label,
        },
        artist: { name: item.artist },
        categories: item.categories || [],
        notes: item.notes,
        track: { title: item.track },
      };
    },
  },
};
