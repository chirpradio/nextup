<template>
  <figure :class="figureClass">
    <div class="d-flex justify-content-between align-items-start">
      <blockquote :class="blockquoteClass" class="flex-grow-1 mb-1">
        <MarkdownRenderer v-if="!isEditing" :text="document.unsafe_text" />
        <MarkdownEditor 
          v-else 
          v-model="editText" 
          :rows="rows"
          class="mb-3"
        />
      </blockquote>
    </div>
    <figcaption      
      class="blockquote-footer"
      :class="footerClass"
    >
      {{ author }} • {{
        formatDate(document.created)
      }}
      <span v-if="document.modified && document.modified !== document.created" class="dot-divider ms-1">
        edited {{ formatDate(document.modified) }} 
      </span>
      <span v-if="canEdit && !isEditing" class="dot-divider ms-1">
        <button class="btn btn-sm btn-link-dark pt-0 ps-1 pe-1 pb-0" @click="startEditing">edit</button>  
      </span>
      <span v-if="isEditing" class="dot-divider ms-2">
        <button
            @click="saveEdit"            
            class="btn btn-sm btn-link pt-0 ps-1 pe-1 pb-0"
            :disabled="saving"
          >{{saveLabel}}</button>
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
import LoadingButton from "../LoadingButton.vue";
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
    LoadingButton,
  },
  data() {
    return {
      isEditing: false,
      editText: "",
      saving: false,
    };
  },
  computed: {
    ...mapStores(useAuthStore, useDocumentsStore),
    author() {
      return this.document.author ? `${this.document.author.first_name} ${this.document.author.last_name}` : this.document.author_name;
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
    saveLabel() {
      return this.saving ? "saving changes" : "save changes";
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
        const updatedDocument = await this.documentsStore.updateDocument(
          this.document.__key.path,
          this.editText
        );
        
        // Update the document object with new content
        this.document.unsafe_text = updatedDocument.unsafe_text;
        this.document.modified = updatedDocument.modified;
        
        this.isEditing = false;
        this.editText = "";
      } catch (error) {
        console.error("Failed to update document:", error);        
      } finally {
        this.saving = false;
      }
    },
  },
  mixins: [formatters],
};
</script>
