<template>
  <div class="tag-totals d-flex justify-content-between justify-content-lg-end">
    <TagTotal
      class="me-3"
      tag="heavy_rotation"
      :total="heavyRotation"
      :expected="2"
    />
    <TagTotal
      class="me-3"
      tag="light_rotation"
      :total="lightRotation"
      :expected="3"
    />
    <TagTotal
      class="me-3"
      tag="local_classic"
      :total="localClassic"
      :expected="1"
    />
    <TagTotal
      class="me-3"
      tag="local_current"
      :total="localCurrent"
      :expected="1"
    />
  </div>
</template>

<style>
.tag-totals {
  font-size: 0.75em;
}

@media (max-width: 576px) {
  .tag-totals {
    font-size: 0.6em;
  }
}
</style>

<script>
import TagTotal from "../playlist/TagTotal.vue";

function topOfHourIso() {
  const date = new Date();
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString();
}

function countBy(events, tag) {
  const filtered = events.filter(
    (event) => event.categories && event.categories.includes(tag)
  );
  return filtered.length;
}

export default {
  components: { TagTotal },
  computed: {
    events() {
      const iso = topOfHourIso();
      return this.$store.getters.events.filter(
        (event) => event.established > iso
      );
    },
    heavyRotation() {
      return countBy(this.events, "heavy_rotation");
    },
    lightRotation() {
      return countBy(this.events, "light_rotation");
    },
    localClassic() {
      return countBy(this.events, "local_classic");
    },
    localCurrent() {
      return countBy(this.events, "local_current");
    },
  },
};
</script>
