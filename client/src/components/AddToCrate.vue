<template>
  <form class="form-inline">
    <select class="custom-select custom-select-sm" :class="{ 'col-6': limitWidth }" v-model="selected" @change="add">
      <option disabled value="">– add to crate –</option>
      <option v-for="crate in crates" :key="crate.id" :value="crate.id">{{ crate.name }}</option>
    </select>
    <small v-if="added" class="ml-2 text-success">added!</small>
    <small v-if="error" class="ml-2 text-danger">error</small>
  </form>
</template>

<script>
export default {
  data() {
    return {
      selected: "",
      added: false,
      error: false,
    }
  },
  props: {
    keyToAdd: {},
    limitWidth: false
  },
  computed: {
    crates () {
      return this.$store.getters.crates;      
    }
  },
  methods: {  
    async add () {
      this.added = false;
      this.error = false;
      try {
        await this.$store.dispatch("addToCrate", {
          crateId: this.selected,
          path: this.keyToAdd.path,
        });   
        this.added = true; 
      } catch (error) {
        this.error = true;
      }
      this.selected = "";
    }
  },
}
</script>