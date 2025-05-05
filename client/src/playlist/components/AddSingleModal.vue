<template>
  <Modal
    ref="modal"
    title="Add single to playlist"
    confirmLabel="add to playlist"
    @confirm="addToPlaylist"
    :showSecondaryBtn="true"
    secondaryLabel="cue track"
    @secondary="cueTrack"
    :loading="adding"
    :error="error"
    :disabled="disabled"
  >
    <CustomTrackForm
      ref="form"
      :required="true"
      :single="true"
      :disabled="singleDisabled"
      @change="updateDisabled"
    />
  </Modal>
</template>

<script>
import Modal from "@/components/ModalDialog.vue";
import CustomTrackForm from "@/components/CustomTrackForm.vue";
import { mapStores } from "pinia";
import { usePlaylistStore } from "../playlistStore";
import playlistMixins from "../mixins";

export default {
  components: { Modal, CustomTrackForm },
  data() {
    return {
      adding: false,
      error: false,
      disabled: true,
      singleDisabled: true,
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
      if (this.$refs.form.item.single) {
        const re = /(.+?)\s*\/\s*"(.+?)"\s*\/\s(.+?)\s*\/\s*(.+)/g;
        const single = re.exec(this.$refs.form.item.single);
        // const single = this.$refs.form.item.single.split("/");
        console.log(single);
        this.$refs.form.item.artist = single[1];
        // const reTrack = /"(.+)"/g;
        // const track = reTrack.exec(single[1]);
        this.$refs.form.item.track = single[2];
        this.$refs.form.item.album = single[3];
        const reLabel = /(.+)\((.+)\)/g;
        const regexResults = reLabel.exec(single[4]);
        this.$refs.form.item.label = regexResults[1];
        this.$refs.form.item.notes = regexResults[2];
        console.log(regexResults);
      }
      this.singleDisabled = !this.$refs.form.item.single;
    },
    async addToPlaylist() {
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
    cueTrack() {
      if (this.$refs.form.checkValidity()) {
        const item = this.$refs.form.item;
        const track = this.convertCrateItemToFreeformTrack(item);
        this.playlistStore.cue(track);
        this.$refs.form.reset();
        this.$refs.modal.hide();
      }
    },
  },
};
</script>
