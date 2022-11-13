<template>
  <div ref="modal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            @click="hide"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <span v-if="error" class="text-danger">There was an error</span>
          <button
            v-if="!loading"
            type="button"
            class="btn btn-light"
            @click="hide"
          >
            {{ cancelLabel }}
          </button>
          <button
            v-if="!loading"
            type="button"
            class="btn btn-chirp-red"
            @click="confirm"
            :disabled="disabled"
          >
            {{ confirmLabel }}
          </button>
          <RecordSpinner v-if="loading" size="sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import RecordSpinner from "../components/RecordSpinner.vue";

const CONFIRM = "confirm";

export default {
  components: { RecordSpinner },
  emits: [CONFIRM],
  props: {
    title: String,
    cancelLabel: {
      type: String,
      default: "Cancel",
    },
    confirmLabel: {
      type: String,
      default: "Confirm",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: undefined,
    };
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
  },
  methods: {
    show() {
      this.modal.show();
    },
    hide() {
      this.modal.hide();
    },
    confirm() {
      this.$emit(CONFIRM);
    },
  },
};
</script>
