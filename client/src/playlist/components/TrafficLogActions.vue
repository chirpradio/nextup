<template>
  <div class="d-flex justify-content-end mb-3">
    <button
      class="btn btn-light btn-sm me-2"
      aria-label="close script"
      @click="close"
    >
      <font-awesome-icon icon="close" />
      close
    </button>
    <button
      v-if="showNav"
      class="btn btn-light btn-sm me-2"
      @click="goToPrevious"
      :disabled="!previous"
    >
      <font-awesome-icon icon="arrow-left" />
      previous
    </button>
    <button
      v-if="showNav"
      class="btn btn-light btn-sm me-2"
      @click="goToNext"
      :disabled="!next"
    >
      next
      <font-awesome-icon icon="arrow-right" />
    </button>
    <button
      class="btn btn-chirp-red btn-sm ms-2"
      aria-label="mark as read"
      @click="markAsRead"
      :disabled="hasBeenRead"
    >
      <font-awesome-icon icon="check" />
      mark as read
    </button>
  </div>
</template>

<script>
const CLOSE = "close";
const PREVIOUS = "previous";
const NEXT = "next";
const MARK_AS_READ = "markAsRead";

export default {
  props: {
    previous: undefined,
    next: undefined,
    hasBeenRead: undefined,
  },
  computed: {
    showNav() {
      return this.previous || this.next;
    },
  },
  emits: [CLOSE, PREVIOUS, NEXT, MARK_AS_READ],
  methods: {
    close() {
      this.$emit(CLOSE);
    },
    goToPrevious() {
      this.$emit(PREVIOUS);
    },
    goToNext() {
      this.$emit(NEXT);
    },
    markAsRead() {
      this.$emit(MARK_AS_READ);
    },
  },
};
</script>
