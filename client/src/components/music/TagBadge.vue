<template>
  <div class="fw-normal text-body" :class="classes">
    <router-link :class="{ disabled: !canNavigate }" :to="this.href">
      <font-awesome-icon :class="getCircleClass(tag)" icon="circle" size="sm" />
      {{ formatTag(tag) }}
    </router-link>
  </div>
</template>
<style scoped>
.disabled {
  pointer-events: none;
}
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
    canNavigate: {
      type: Boolean,
      default: true,
    },
    tag: String,
  },
  mixins: [formatters],
  computed: {
    href() {
      const isLocalTag = this.tag.includes("local");
      return isLocalTag
        ? `/library/search/album?index=album&album%5Blocal%5D=${this.tag}&offset=0&limit=50`
        : { name: "tag", params: { tag: this.tag } };
    },
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
