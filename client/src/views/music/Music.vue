<template>
  <div class="container-fluid">
    <Breadcrumb v-if="!this.$route.meta.hideBreadcrumb" />
    <router-view />
  </div>
</template>

<script>
import Breadcrumb from "../../components/music/Breadcrumb";
import { mapStores } from "pinia";
import { useCratesStore } from "../../stores/crates";

export default {
  components: { Breadcrumb },
  computed: {
    ...mapStores(useCratesStore),
  },
  async created() {
    if (this.cratesStore.crates.length === 0) {
      await this.cratesStore.getCrates();
    }
  },
};
</script>
