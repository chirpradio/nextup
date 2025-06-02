<template>
  <aside class="offcanvas offcanvas-end drawer" ref="aside">
    <div class="offcanvas-header">
      <slot name="header"></slot>
    </div>
    <div class="offcanvas-body">
      <slot name="body"></slot>
    </div>
  </aside>
</template>

<script>
import { Offcanvas } from "bootstrap";
import { debounce } from "lodash";

let debouncedResizeHandler;

export default {
  data() {
    return {
      drawer: undefined,
    };
  },
  mounted() {
    debouncedResizeHandler = debounce(this.onResize, 150);
    window.addEventListener("resize", debouncedResizeHandler);
    this.createOffcanvas();
  },
  beforeUnmount() {
    this.drawer.hide();
  },
  unmounted() {
    window.removeEventListener("resize", debouncedResizeHandler);
  },
  methods: {
    onResize() {
      const shown = this.drawer._isShown;
      if (shown) {
        this.drawer.hide();
      }
      this.createOffcanvas();
      if (shown) {
        this.drawer.show();
      }
    },
    createOffcanvas() {
      const inLargeViewport = document.documentElement.clientWidth >= 1600;
      this.drawer = new Offcanvas(this.$refs.aside, {
        backdrop: !inLargeViewport,
        scroll: inLargeViewport,
      });
    },
    show() {
      this.drawer.show();
    },
    hide() {
      this.drawer.hide();
    },
  },
};
</script>
