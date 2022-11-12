<template>
  <Modal
    ref="modal"
    title="Add track to playlist"
    confirmLabel="Add track"
    @confirm="onConfirm"
    :loading="adding"
    :error="error"
    :disabled="disabled"
  >
    <CustomTrackForm ref="form" :required="true" @change="updateDisabled" />
  </Modal>
</template>

<script>
import Modal from "../Modal.vue";
import CustomTrackForm from "../CustomTrackForm.vue";
import { mapStores } from "pinia";
import { usePlaylistStore } from "../../stores/playlist";

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
          await this.playlistStore.addFreeformPlaylistTrack({
            album: {
              title: item.album,
              label: item.label,
            },
            artist: { name: item.artist },
            categories: item.categories || [],
            notes: item.notes,
            track: { title: item.track },
          });
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
