<template>
  <figure :class="figureClass">
    <div class="d-flex justify-content-between align-items-start">
      <blockquote :class="blockquoteClass" class="flex-grow-1 mb-1">
        <MarkdownRenderer v-if="!isEditing" :text="document.unsafe_text" />
        <MarkdownEditor v-else v-model="editText" :rows="rows" class="mb-3" />
      </blockquote>
    </div>
    <figcaption class="blockquote-footer" :class="footerClass">
      {{ author }} ({{ dateLabel(document) }})
      <span v-if="canEdit && !isEditing" class="dot-divider ms-1">
        <button
          class="btn btn-sm btn-link-dark pt-0 ps-1 pe-1 pb-0"
          @click="startEditing"
        >
          edit
        </button>
      </span>
      <span v-if="isEditing" class="dot-divider ms-2">
        <button
          @click="saveEdit"
          class="btn btn-sm btn-link pt-0 ps-1 pe-1 pb-0"
          :disabled="saving"
        >
          {{ saveLabel }}
        </button>
      </span>
      <span v-if="isEditing && !saving" class="dot-divider ms-1">
        <button
          @click="cancelEdit"
          :disabled="saving"
          class="btn btn-sm btn-link-dark pt-0 ps-1 pe-1 pb-0"
        >
          cancel
        </button>
      </span>
      <span v-if="canDelete && !isEditing" class="dot-divider ms-1">
        <button
          class="btn btn-sm btn-link-dark pt-0 ps-1 pe-1 pb-0"
          @click="confirmDelete"
          :disabled="deleting"
        >
          {{ deleteLabel }}
        </button>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.dot-divider::before {
  content: "•";
}
</style>

<script>
import formatters from "@/mixins/formatters";
import MarkdownRenderer from "./MarkdownRenderer.vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useDocumentsStore } from "@/stores/documents";

export default {
  props: {
    document: Object,
    compact: {
      type: Boolean,
      default: false,
    },
    bottomBorder: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Number,
      default: 2,
    },
  },
  components: {
    MarkdownRenderer,
    MarkdownEditor,
  },
  data() {
    return {
      isEditing: false,
      editText: "",
      saving: false,
      deleting: false,
    };
  },
  computed: {
    ...mapStores(useAuthStore, useDocumentsStore),
    author() {
      return this.document.author
        ? `${this.document.author.first_name} ${this.document.author.last_name}`
        : this.document.author_name;
    },
    figureClass() {
      return {
        "border-bottom": this.bottomBorder,
      };
    },
    blockquoteClass() {
      return {
        blockquote: !this.compact,
      };
    },
    footerClass() {
      return {
        "mt-2": !this.compact,
      };
    },
    canEdit() {
      return this.authStore.canEditDocument(this.document);
    },
    canDelete() {
      return this.authStore.canDeleteDocument(this.document);
    },
    saveLabel() {
      return this.saving ? "saving changes" : "save changes";
    },
    deleteLabel() {
      return this.deleting ? "deleting..." : "delete";
    },
  },
  methods: {
    startEditing() {
      this.editText = this.document.unsafe_text;
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editText = "";
    },
    async saveEdit() {
      if (this.editText.trim() === "") {
        return;
      }

      this.saving = true;

      try {
        await this.documentsStore.updateDocument(this.document, this.editText);
        this.isEditing = false;
        this.editText = "";
      } catch (error) {
        console.error("Failed to update document:", error);
      } finally {
        this.saving = false;
      }
    },
    confirmDelete() {
      if (
        confirm(
          `Are you sure you want to delete this ${this.document.doctype}? This action cannot be undone.`
        )
      ) {
        this.deleteDocument();
      }
    },
    async deleteDocument() {
      this.deleting = true;

      try {
        await this.documentsStore.deleteDocument(this.document);
      } catch (error) {
        console.error("Failed to delete document:", error);
      } finally {
        this.deleting = false;
      }
    },
    modifiedLabel(document) {
      if (document && document.modified && new Date(document.modified) - new Date(document.created) > 1) {
        return `, edited ${this.formatDate(document.modified)}`;
      }
      
      return "";
    },
    dateLabel(document) {
      return `${this.formatDate(document.created)}${this.modifiedLabel(document)}`;
    },  
  },
  mixins: [formatters],
};
</script>
