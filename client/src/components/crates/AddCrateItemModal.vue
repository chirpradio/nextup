<template>
  <Modal
    ref="modal"
    title="Add your own item"
    confirmLabel="Add item"
    @confirm="addItem"
    :loading="adding"
    :error="error"
  >
    <p class="text-muted">
      Add something to your crate that's not in the CHIRP library
    </p>
    <CustomTrackForm ref="form" />
  </Modal>
</template>

<script>
import Modal from "../ModalDialog.vue";
import CustomTrackForm from "../CustomTrackForm.vue";
import { mapStores } from "pinia";
import { useCratesStore } from "../../stores/crates";

const ADDED = "added";

export default {
  components: { Modal, CustomTrackForm },
  emits: [ADDED],
  props: {
    crateId: String,
  },
  data() {
    return {
      adding: false,
      error: false,
    };
  },
  computed: {
    ...mapStores(useCratesStore),
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.form.reset();
      this.$refs.modal.hide();
    },
    async addItem() {
      this.adding = true;

      try {
        await this.cratesStore.addToCrate({
          crateId: this.crateId,
          params: { item: this.$refs.form.item },
        });
        this.hide();
        this.$emit(ADDED);
      } catch (error) {
        this.error = true;
      }
      this.adding = false;
    },
  },
};
</script>
