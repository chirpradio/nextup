<template>
  <Modal
    ref="modal"
    title="Add track to playlist"
    confirmLabel="add to playlist"
    @confirm="onConfirm"
    :loading="adding"
    :error="error"
    :disabled="disabled"
  >
    <CustomTrackForm ref="form" :required="true" @change="updateDisabled" />
  </Modal>
</template>

<script>
import Modal from "@/components/ModalDialog.vue";
import CustomTrackForm from "@/components/CustomTrackForm.vue";
import { mapStores } from "pinia";
import { usePlaylistStore } from "../store";
import playlistMixins from "../mixins";

export default {
  components: { Modal, CustomTrackForm },
  data() {
    return {
      adding: false,
      error: false,
      disabled: true,
    };
  },
  computed: {
    ...mapStores(usePlaylistStore),
  },
  mixins: [playlistMixins],
  methods: {
    show() {
      this.$refs.modal.show();
    },
    updateDisabled() {
      this.disabled = !this.$refs.form.checkValidity();
    },
    async onConfirm() {
      if (this.$refs.form.checkValidity()) {
        try {
          this.error = false;
          this.adding = true;
          const item = this.$refs.form.item;
          const track = this.convertCrateItemToFreeformTrack(item);
          await this.playlistStore.addFreeformPlaylistTrack(track);
          this.$refs.form.reset();
          this.$refs.modal.hide();
        } catch (error) {
          this.error = true;
          console.error(error);
        } finally {
          this.adding = false;
        }
      }
    },
  },
};
</script>
