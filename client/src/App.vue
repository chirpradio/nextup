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
import { mapStores } from "pinia";
import { useAuthStore } from "./stores/auth";
import api from "./services/api.service";

export default {
  components: {
    NavBar,
  },
  computed: {
    ...mapStores(useAuthStore),
  },
  watch: {
    "authStore.isAuthenticated": function (newVal) {
      if (newVal === true) {
        api.setAuthorizationHeader(this.authStore.token);
        this.$router.push(this.$route.query.redirect || "/");
      } else {
        this.$router.go();
      }
    },
  },
};
</script>
