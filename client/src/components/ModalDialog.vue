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
            v-if="!loading && showSecondaryBtn"
            type="button"
            class="btn btn-outline-chirp-red"
            @click="secondaryAction"
            :disabled="disabled"
          >
            {{ secondaryLabel }}
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
import RecordSpinner from "./RecordSpinner.vue";

const CONFIRM = "confirm";
const SECONDARY = "secondary";

export default {
  components: { RecordSpinner },
  emits: [CONFIRM, SECONDARY],
  props: {
    title: String,
    cancelLabel: {
      type: String,
      default: "cancel",
    },
    confirmLabel: {
      type: String,
      default: "confirm",
    },
    secondaryLabel: {
      type: String,
    },
    showSecondaryBtn: {
      type: Boolean,
      default: false,
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
    secondaryAction() {
      this.$emit(SECONDARY);
    },
  },
};
</script>
