<template>
  <li class="list-inline-item edit-button" @click="show">
    <div class="fw-normal text-body badge rounded-pill border">
      <font-awesome-icon class="opacity-50 pe-1" icon="edit" size="sm" />
      <span class="opacity-75">Edit</span>
    </div>
  </li>
  <Modal
    title="Edit Album"
    ref="modal"
    @confirm="setAlbumInfo"
    confirm-label="Update"
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

    <div
      v-for="group in Object.keys(groupedTags)"
      :key="group"
      class="w-50 d-inline-block mt-1"
    >
      <h5 class="mt-1 mb-1 text-capitalize">{{ group }}</h5>
      <ul class="list-unstyled">
        <!-- Create two radio button groups for 'local' and 'rotation' tags,
          that allow you to select one of the valid tags or 'Neither', a null placeholder value -->
        <li v-for="tag in groupedTags[group].tags" :key="tag">
          <input
            class="me-1"
            type="radio"
            :value="tag"
            v-model="groupedTags[group].selected"
          />
          <Tag
            class="selectable-tag"
            :class="{ selected: groupedTags[group].selected == tag }"
            :tag="tag !== null ? tag : 'Neither'"
            @click="groupedTags[group].selected = tag"
          />
        </li>
      </ul>
    </div>
  </Modal>
</template>

<script>
import Modal from "../ModalDialog.vue";
import Tag from "./TagBadge.vue";

import { mapStores } from "pinia";
import { useAlbumsStore } from "@/stores/albums";
import { allowedTags } from "@/constants";

const tagGroups = ["local", "rotation"];

export default {
  name: "EditAlbumInfo",
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
      groupedTags: tagGroups.reduce((gts, tagGroup) => {
        return {
          ...gts,
          [tagGroup]: {
            selected:
              this.currentTags?.find((tag) => tag.includes(tagGroup)) || null,
            tags: allowedTags
              .filter((tag) => tag.includes(tagGroup))
              .concat(null), //Add a null as the value for a 'neither' option in the checkbox group,
          },
        };
      }, {}),
     form: this.buildForm(),
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
    buildForm() {
      return {
        label: this.album.label || "",
        year: this.album.year || "",
        pronunciation: this.album.pronunciation || "",
      };
    },
    show() {
      this.form = this.buildForm();
      this.$refs.modal.show();
    },
    setAlbumInfo() {
      let tags = tagGroups
        .map((tagGroup) => this.groupedTags[tagGroup].selected)
        .filter(
          (tag) =>
            tag !== null && tag !== undefined && allowedTags.includes(tag)
        );
      this.albumsStore.updateAlbum({
        album: this.album,
        tags,
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
.edit-button {
  cursor: pointer;
}

.selectable-tag {
  opacity: 0.6;
}
.selectable-tag:hover,
.selectable-tag.selected {
  opacity: 1;
}
</style>
