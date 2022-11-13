<template>
  <div class="fw-normal text-body" :class="classes">
    <font-awesome-icon :class="getCircleClass(tag)" icon="circle" size="sm" />
    {{ formatTag(tag) }}
  </div>
</template>

<style scoped>
.heavy_rotation {
  color: rgba(255, 0, 0, 0.67);
}

.light_rotation {
  /* color: rgb(34, 133, 34); */
  color: rgba(0, 128, 0, 0.67);
}

.local_classic {
  color: #ffbf40ac;
}

.local_current {
  color: rgba(0, 0, 255, 0.67);
}
</style>

<script>
import formatters from "../../mixins/formatters";

export default {
  props: {
    badge: {
      type: Boolean,
      default: true,
    },
    tag: String,
  },
  mixins: [formatters],
  computed: {
    classes() {
      const classes = {};
      if (this.badge) {
        classes["badge"] = true;
        classes["rounded-pill"] = true;
        classes["border"] = true;
        classes["bg-light"] = true;
      } else {
        classes["font-sans"] = true;
      }

      return classes;
    },
  },
  methods: {
    getCircleClass(tag) {
      let classObj = {};
      classObj[tag] = true;
      return classObj;
    },
  },
};
</script>
