<template>
  <li class="list-inline-item edit-tags-button" @click="show">
    <div class="fw-normal text-body badge rounded-pill border">
      <font-awesome-icon class="opacity-50 pr-2" icon="edit" size="sm" />
      <span class="opacity-75">Edit Tags</span>
    </div>
  </li>
  <Modal title="Edit tags" ref="modal" @confirm="setAlbumTags" confirm-label="Update Tags">
    <h3> {{ albumTitle }}</h3>
    <h4>by {{ album.album_artist.name  }}</h4>
    <ul>
      <li v-for="tag in allowedTags" :key="tag">
        <input
          class="mr-2"
          type="checkbox"
          :name="tag"
          :value="tag"
          v-model="selectedTags[tag]"
        />
        <Tag
          class="selectable-tag"
          :class="{ selected: selectedTags[tag] }"
          :tag="tag"
          @click="selectedTags[tag] = !selectedTags[tag]"
        />
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
  name: "EditTagsButton",
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
      let tags = allowedTags.filter((tag) => this.selectedTags[tag]);
      this.albumsStore.updateAlbumTags({
        album: this.album,
        tags,
      });
      this.$refs.modal.hide();
    },
  },
};
</script>
<style scoped>
.edit-tags-button {
  cursor: pointer;
}
.pr-2 {
  padding-right: 0.25rem;
}

.mr-2 {
  margin-right: 0.25rem;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

.selectable-tag {
  opacity: 0.6;
}
.selectable-tag:hover,
.selectable-tag.selected {
  opacity: 1;
}
</style>
