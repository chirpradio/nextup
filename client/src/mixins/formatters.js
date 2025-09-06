function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  methods: {
    capitalizeFirstLetter,
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });
    },
    formatTag(value) {
      return value.split("_").map(capitalizeFirstLetter).join(" ");
    },
  },
};
