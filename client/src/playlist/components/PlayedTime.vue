<template>
  <span>{{ timeLabel }}</span>
</template>

<script>
export default {
  props: {
    date: String,
  },
  computed: {
    dateObj() {
      if (this.date) {
        return new Date(this.date);
      } else {
        return new Date();
      }
    },
    timeLabel() {
      return this.dateObj.toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>
