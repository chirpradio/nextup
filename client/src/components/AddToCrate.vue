<template>
  <form class="form-inline">
    <select class="custom-select custom-select-sm" v-bind:class="{ 'w-100': fullWidth }" @change="add">
      <option>add to crate</option>
      <option v-for="crate in crates" :key="crate.key.id" v-bind:value="crate.key.id">{{ crate.name }}</option>
    </select>
  </form>
</template>

<script>
export default {
  props: {
    keyToAdd: {},
    fullWidth: false
  },
  computed: {
    crates () {
      return this.$store.state.crates;      
    }
  },
  methods: {
    add (event) {
      console.log(this.keyToAdd);
    }
  }
}
</script>