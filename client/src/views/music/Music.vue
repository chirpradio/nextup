<template>
  <div>
    <Breadcrumb v-if="!this.$route.meta.hideBreadcrumb" />
    <router-view />
  </div>
</template>

<script>
import Breadcrumb from "../../components/music/Breadcrumb"

export default {
  components: { Breadcrumb, },
}
</script>