<template>
  <form class="add-to-crate row">
    <div class="col-11 mt-0">
      <select
        class="form-select form-select-sm"
        v-model="selected"
        @change="add"
      >
        <option disabled value="">+ add to crate</option>
        <optgroup v-if="lastAddedTo" label="Last added to">
          <option :value="lastAddedTo.id">{{ lastAddedTo.name }}</option>
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
        icon="circle-check"
        class="text-success"
      />
      <font-awesome-icon
        v-if="error"
        icon="circle-exclamation"
        class="text-danger"
      />
    </div>
  </form>
</template>

<style>
.add-to-crate select {
  color: var(--dark-red);
  border-color: var(--dark-red);
}
</style>

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
    lastAddedTo() {
      return this.$store.getters.lastAddedTo;
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
