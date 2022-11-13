<template>
  <div class="container-fluid">
    <Breadcrumb v-if="!this.$route.meta.hideBreadcrumb" />
    <router-view />
  </div>
</template>

<script>
import Breadcrumb from "@/components/music/Breadcrumb.vue";

export default {
  components: { Breadcrumb },
};
</script>
