<template>
  <div class="container-fluid">
    <BreadCrumbs v-if="!this.$route.meta.hideBreadcrumb" />
    <router-view />
  </div>
</template>

<script>
import BreadCrumbs from "@/components/music/BreadCrumbs.vue";

export default {
  components: { BreadCrumbs },
};
</script>
