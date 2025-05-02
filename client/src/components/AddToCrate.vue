<template>
  <div class="dropdown">
    <button
      class="btn btn-sm dropdown-toggle w-100"
      :class="buttonClass"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <font-awesome-icon :icon="icon" :class="iconClass" :spin="adding" />
      <span class="ms-1 me-1">add to crate</span>
    </button>
    <ul class="dropdown-menu">
      <li v-if="lastAddedTo">
        <button class="dropdown-item" @click="addTo(lastAddedTo)">
          {{ lastAddedTo.name }}
        </button>
      </li>
      <li v-if="lastAddedTo"><hr class="dropdown-divider" /></li>
      <li v-for="crate in crates" :key="crate.id">
        <button class="dropdown-item" @click="addTo(crate)">
          {{ crate.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useCratesStore } from "../stores/crates";

export default {
  data() {
    return {
      adding: false,
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
    ...mapStores(useCratesStore),
    crates() {
      return this.cratesStore.crates;
    },
    lastAddedTo() {
      return this.cratesStore.lastAddedTo;
    },
    icon() {
      if (this.adding) return "compact-disc";
      if (this.added) return "circle-check";
      if (this.error) return "circle-exclamation";
      return "circle-plus";
    },
    iconClass() {
      return {
        "text-white": this.added || this.error,        
      };
    },
    buttonClass() {
      return {
        "btn-outline-chirp-red": !this.added && !this.error,
        "btn-success": this.added,
        "btn-danger": this.error,
      };
    }
  },
  methods: {
    async addTo(crate) {
      this.added = false;
      this.error = false;
      this.adding = true;
      try {
        await this.cratesStore.addToCrate({
          crateId: crate.id,
          params: {
            path: this.keyToAdd.path,
          },
        });
        this.added = true;
      } catch (error) {
        this.error = true;
        setTimeout(() => (this.error = false), 4000);
      }
      this.adding = false;
      setTimeout(() => (this.added = false), 4000);
    },
  },
};
</script>
