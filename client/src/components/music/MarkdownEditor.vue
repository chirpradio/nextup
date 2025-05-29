<template>
  <div class="markdown-editor d-flex flex-column bg-light p-2">
    <div class="d-flex bg-light align-items-center">
      <button class="btn btn-light btn-sm" @click="bold" title="bold" :disabled="previewMode">
        <font-awesome-icon icon="bold" />
      </button>
      <button class="btn btn-light btn-sm" @click="italic" title="italic" :disabled="previewMode">
        <font-awesome-icon icon="italic" />
      </button>
      <button class="btn btn-light btn-sm" @click="underline" title="underline" :disabled="previewMode">
        <font-awesome-icon icon="underline" />
      </button>
      <button class="btn btn-light btn-sm" @click="link" title="link" :disabled="previewMode">
        <font-awesome-icon icon="link" />
      </button>
    </div>
    <div class="text-content bg-white mt-1 flex-grow-1 d-flex flex-column">
      <textarea
        v-if="!previewMode"
        ref="ta"
        class="w-100 ps-1 pt-1 border-0"
        :value="modelValue"
        :rows="rows"
        @input="onInput"
        @change="onInput"
      />
      <MarkdownRenderer
        v-if="previewMode"
        class="flex-grow-1 ps-1 pt-1"        
        :text="modelValue"
      />
    </div>
    <div>
      <input id="previewCheck" type="checkbox" v-model="previewMode" />
      <label for="previewCheck" class="ms-1 preview-label">preview formatting</label>
    </div>
  </div>
</template>

<style scoped>
.markdown-editor {
  min-height: 7em;
}

.text-content {
  border: 1px solid #ccc;
  min-height: 3.5em;
}

textarea {
  resize: none;
}

.preview-label {
  font-size: 0.875em;
}

</style>

<script>
import MarkdownRenderer from "./MarkdownRenderer.vue";

const UPDATE = "update:modelValue";

export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    rows: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      previewMode: false,
    };
  },
  components: {
    MarkdownRenderer,
  },
  emits: [UPDATE],
  methods: {
    onInput(event) {
      this.$emit(UPDATE, event.target.value);
    },
    wrapOrUnwrap(startMarker, endMarker) {
      const ta = this.$refs.ta;
      const text = this.modelValue;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const before = text.substring(start - startMarker.length, start);
      const after = text.substring(end, end + endMarker.length);
      let operation;

      ta.focus();
      if (before === startMarker && after === endMarker) {
        operation = "unwrap";
        // remove markers
        ta.value =
          text.substring(0, start - startMarker.length) +
          text.substring(start, end) +
          text.substring(end + endMarker.length, text.length);
        // select original text
        ta.setSelectionRange(
          start - startMarker.length,
          end - startMarker.length
        );
      } else {
        operation = "wrap";
        // wrap selected text
        ta.setRangeText(startMarker + text.substring(start, end) + endMarker);
        // select original text
        ta.setSelectionRange(
          start + startMarker.length,
          start + startMarker.length + (end - start)
        );
      }

      this.$emit(UPDATE, ta.value);
      return operation;
    },
    bold() {
      this.wrapOrUnwrap("**", "**");
    },
    italic() {
      this.wrapOrUnwrap("_", "_");
    },
    underline() {
      this.wrapOrUnwrap("<u>", "</u>");
    },
    link() {
      const ta = this.$refs.ta;
      const end = ta.selectionEnd;
      const operation = this.wrapOrUnwrap("[", "](url)");
      if (operation === "wrap") {
        // select "url"
        ta.setSelectionRange(end + 3, end + 6);
      }
    },
  },
};
</script>
