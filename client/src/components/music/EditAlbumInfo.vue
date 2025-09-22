<template>
  <li class="list-inline-item edit-album-info-button" @click="show"
    v-if="canEditAlbum">
    <div class="fw-normal text-body badge rounded-pill border"
	    >
      <font-awesome-icon class="opacity-50 pe-1" icon="edit" size="sm" />
      <span class="opacity-75">Edit Info</span>
    </div>
  </li>
  <Modal
    title="Edit info"
    ref="modal"
    @confirm="setAlbumInfo"
    confirm-label="Update Info"
  >
    <h3>{{ albumTitle }}</h3>
    <h4 v-if="album.album_artist">by {{ album.album_artist.name }}</h4>

    <div class="mt-3">
      <label class="col-sm-3 col-form-label">Label</label>
      <input
        v-model="form.label"
        type="text"
        class="form-control"
        placeholder="Enter label"
      />
    </div>

    <div class="mt-3">
      <label class="col-sm-3 col-form-label">Year</label>
      <input
        v-model="form.year"
        type="number"
        class="form-control"
        placeholder="Enter year"
      />
    </div>

    <div class="mt-3">
      <label class="col-sm-3 col-form-label">Pronunciation</label>
      <input
        v-model="form.pronunciation"
        type="text"
        class="form-control"
        placeholder="Enter pronunciation"
      />
    </div>
    <div class="mt-3 form-check">
    <input
      v-model="form.is_compilation"
      type="checkbox"
      class="form-check-input"
      id="isCompilation"
    />
    <label class="form-check-label" for="isCompilation">
      Compilation
    </label>
</div>

  </Modal>
</template>

<script>
import Modal from "../ModalDialog.vue";
import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";
import { useAuthStore } from "@/stores/auth";


export default {
  name: "EditAlbumInfoButton",
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  components: { Modal },
  data() {
    return {
      form: {
        label: this.album.label || "",
        year: this.album.year || "",
        pronunciation: this.album.pronunciation || "",
        is_compilation: this.album.is_compilation || true,
      },
    };
  },
  computed: {
    ...mapStores(useAlbumsStore),
    ...mapStores(useAuthStore),

    albumTitle() {
      let title = this.album.title;

      if (this.album.disc_number) {
        title += ` (Disc ${this.album.disc_number})`;
      }

      return title;
    },
    canEditAlbum() {
      return this.authStore.hasRole("music_director");
    }
  },
  methods: {
    show() {
      this.form = {
        label: this.album.label || "",
        year: this.album.year || "",
        pronunciation: this.album.pronunciation || "",
	is_compilation: this.album.is_compilation || false,
      };
      this.$refs.modal.show();
    },
    setAlbumInfo() {
      this.albumsStore.updateAlbumInfo({
        album: this.album,
        label: this.form.label,
        year: this.form.year,
        pronunciation: this.form.pronunciation,
      });
      this.$refs.modal.hide();
    },
  },
};
</script>

<style scoped>
.edit-album-info-button {
  cursor: pointer;
}
</style>


