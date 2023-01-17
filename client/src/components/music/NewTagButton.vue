<template>
  <li class="list-inline-item" @click="show">
    <div class="fw-normal text-body badge rounded-pill border">
      <font-awesome-icon class="opacity-50 pr-1" icon="plus" size="sm" />
      <span class="opacity-75">Add Tag</span>
    </div>
  </li>
  <Modal title="Edit tags" ref="modal" @confirm="setAlbumTags">
    <h2>{{ albumTitle }}</h2>

    <ul>
      <li v-for="tag in allowedTags" :key="tag">
        <input type="checkbox" :name="tag" :value="tag" v-model="selectedTags[tag]" />
        <Tag :tag="tag" @click="selectedTags[tag] = !selectedTags[tag]"/>
      </li>
    </ul>
  </Modal>
</template>

<script>
import Modal from "../ModalDialog.vue";
import Tag from "./TagBadge.vue";

import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";

const allowedTags = [
  "local_current",
  "local_classic",
  "heavy_rotation",
  "light_rotation",
];

export default {
  name: "NewTagButton",
  props: {
    currentTags: {
      type: Array,
      default() {
        return [];
      },
    },
    album: Object,
  },
  components: { Modal, Tag },
  data() {
    return {
      isNewTagPopupOpen: false,
      allowedTags,
      selectedTags: allowedTags.reduce((tagsObject, tag) => {
        return {
          ...tagsObject,
          [tag]: this.currentTags.includes(tag),
        };
      }, {}),
    };
  },
  computed: {
    ...mapStores(useAlbumsStore),
    albumTitle() {
      let title = this.album.title;

      if (this.album.disc_number) {
        title += ` (Disc ${this.album.disc_number})`;
      }

      return title;
    },
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    setAlbumTags() {
      let tags = allowedTags.filter(tag => this.selectedTags[tag])
      this.albumsStore.updateAlbumTags({
        album: this.album,
        tags,
      });
    }
  },
};
</script>
