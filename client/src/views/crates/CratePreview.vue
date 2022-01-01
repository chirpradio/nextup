<template>
  <li>
    <div>
      <router-link
        :to="{ name: 'crate', params: { id: crate.id } }"
        :title="name"
        >{{ name }}</router-link
      >
    </div>
    <span>{{ crate.totalItems }} {{ itemLabel }}</span>
  </li>
</template>

<script>
export default {
  name: "CratePreview",
  props: {
    crate: Object,
  },
  computed: {
    itemLabel() {
      return this.crate.totalItems === 1 ? "item" : "items";
    },
    name() {
      return this.crate.name || "<No name>";
    },
  },
};
</script>
