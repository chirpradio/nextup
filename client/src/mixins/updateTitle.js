export default {
  methods: {
    updateTitle(prefix) {
      const suffix = "NextUp";
      document.title = prefix ? `${prefix} – ${suffix}` : suffix;
    },
  }, 
};
