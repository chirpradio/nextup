<template>
  <form class="row g-2">
    <div class="col-11">
      <select
        class="form-select form-select-sm"
        v-model="selected"
        @change="add"
      >
        <option disabled value="">+ add to crate</option>
        <optgroup v-if="mostRecent" label="Most recent">
          <option :value="mostRecent.id">{{ mostRecent.name }}</option>
        </optgroup>
        <optgroup label="A-Z">
          <option v-for="crate in crates" :key="crate.id" :value="crate.id">
            {{ crate.name }}
          </option>
        </optgroup>
      </select>
    </div>
    <div class="col-1">
      <font-awesome-icon
        v-if="added"
        icon="check-circle"
        class="text-success"
      />
      <font-awesome-icon
        v-if="error"
        icon="exclamation-circle"
        class="text-danger"
      />
    </div>
  </form>
</template>

<style scoped></style>

<script>
export default {
  data() {
    return {
      selected: "",
      added: false,
      error: false,
    };
  },
  props: {
    keyToAdd: {},
    limitWidth: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    crates() {
      return this.$store.getters.crates;
    },
    mostRecent() {
      return this.$store.getters.mostRecent;
    },
  },
  methods: {
    async add() {
      this.added = false;
      this.error = false;
      try {
        await this.$store.dispatch("addToCrate", {
          crateId: this.selected,
          params: {
            path: this.keyToAdd.path,
          },
        });
        this.added = true;
      } catch (error) {
        this.error = true;
        setTimeout(() => (this.error = false), 2000);
      }
      this.selected = "";
      setTimeout(() => (this.added = false), 2000);
    },
  },
};
</script>
