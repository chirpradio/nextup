<template>
  <div class="d-flex">
    <component :is="tag" v-if="!editing" class="d-inline">{{
      value
    }}</component>
    <input
      ref="input"
      v-model="value"
      v-if="editing"
      class="p-0 m-0"
      :class="inputClasses"
      :size="size"
      @keydown.enter="save"
    />
    <button
      class="btn btn-link-chirp-red"
      v-if="!editing"
      @click="edit"
      aria-label="edit"
    >
      <font-awesome-icon icon="pen-to-square" />
    </button>
    <button
      class="btn btn-link-chirp-red"
      v-if="editing"
      @click="save"
      aria-label="save"
    >
      <font-awesome-icon icon="square-check" />
    </button>
  </div>
</template>

<script>
export default {
  name: "EditableHeading",
  props: {
    headingLevel: {
      type: Number,
      default: 1,
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editing: false,
      value: this.text,
    };
  },
  computed: {
    inputClasses() {
      const classObj = {};
      classObj[this.tag] = true;
      return classObj;
    },
    tag() {
      return `h${this.headingLevel}`;
    },
    size() {
      return Math.min(this.value.length, 50);
    },
  },
  methods: {
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    save() {
      this.$emit("save", { value: this.value });
      this.editing = false;
    },
  },
};
</script>
