<template>
  <div class="position-relative">
    <input
      class="form-control"
      :value="modelValue"
      @focusin="enableResults"
      @input="onInput"
      @keydown.down="incrementIndex"
      @keydown.up="decrementIndex"
      @keydown.enter="select"
      @focusout="disableResults"
      :required="required"
    />
    <ul
      v-if="showResults"
      class="list-group position-absolute top-100 w-100 shadow"
    >
      <li
        v-for="(artist, index) in artists"
        :key="artist._id"
        class="list-group-item"
        :class="{ active: activeIndex === index }"
      >
        {{ artist._source.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useSearchStore } from "@/stores/search";

const UPDATE = "update:modelValue";

export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeIndex: -1,
      showResults: false,
    };
  },
  computed: {
    ...mapStores(useSearchStore),
    artists() {
      return this.modelValue.length
        ? this.searchStore.results["artist"]?.hits
        : [];
    },
  },
  emits: [UPDATE],
  methods: {
    enableResults() {
      this.showResults = true;
    },
    onInput: async function (event) {
      this.$emit(UPDATE, event.target.value);
      this.enableResults();
      this.activeIndex = -1;
      await this.searchStore.search({
        term: event.target.value,
        index: "artist",
        limit: 5,
        as_you_type: true
      });
    },
    incrementIndex() {
      this.activeIndex++;
      if (this.activeIndex === this.artists.length) {
        this.activeIndex = 0;
      }
    },
    decrementIndex(event) {
      event.preventDefault();
      this.activeIndex--;
      if (this.activeIndex < 0) {
        this.activeIndex = this.artists.length - 1;
      }
    },
    select() {
      this.disableResults();
      const artist = this.artists[this.activeIndex];
      this.$emit(UPDATE, artist._source.name);
    },
    disableResults() {
      this.showResults = false;
    },
  },
};
</script>
