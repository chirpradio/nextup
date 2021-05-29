export default {
  methods: {
    removeEmptyStrings (obj) {
      return Object.entries(obj)
        .filter(([_, v]) => v !== "")
        .reduce(
          (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? this.removeEmptyStrings(v) : v }),
          {}
        );
    }
  }
}