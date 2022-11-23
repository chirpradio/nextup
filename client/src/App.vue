<template>
  <NavBar />
  <main>
    <router-view class="container-fluid py-3 main-view" />
  </main>
</template>

<style lang="scss">
@import "./scss/styles.scss";
</style>

<script>
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
};
</script>
