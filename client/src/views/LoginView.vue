<template>
  <div class="col-12 col-md-6" v-if="!this.isAuthenticated">
    <h2>Log in to NextUp</h2>
    <p class="text-muted" v-if="$route.query.redirect">
      You need to log in first.
    </p>
    <div v-if="message" :class="alertClasses" role="alert">
      {{ message }}
    </div>
    <form class="mb-3" @submit.prevent="logIn">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" class="form-control" v-model="email" required />
      </div>
      <div class="mb-3 mt-3">
        <label for="password">Password</label>
        <input
          id="password"
          class="form-control"
          v-model="password"
          type="password"
          required
        />
      </div>
      <LoadingButton
        class="btn-chirp-red"
        type="submit"
        icon="right-to-bracket"
        label="log in"
        :loading="authenticating"
      />
    </form>
    <p v-if="error" class="text-danger">{{ errorMessage }}</p>
  </div>
</template>

<script>
import LoadingButton from "../components/LoadingButton.vue";
import { mapState, mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";
import routeNames from "@/router/names";

export default {
  components: { LoadingButton },
  data() {
    return {
      email: "",
      password: "",
      error: false,
      errorMessage: "",
      authenticating: false,
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    ...mapState(useAuthStore, ["isAuthenticated", "message", "messageType"]),
    alertClasses() {
      const alertType = `alert-${this.messageType}`;
      return {
        alert: true,
        [alertType]: true,
      };
    },
  },
  methods: {
    async logIn() {
      try {
        this.authenticating = true;
        this.error = false;
        const result = await this.authStore.logIn({
          email: this.email,
          password: this.password,
        });

        if (result?.password_reset_required) {
          this.authStore.password_reset_required = true;
          this.authStore.email = result.email || this.email;
          this.$router.push({
            name: routeNames.CHANGE_PASSWORD,
          });
          return;
        }
      } catch (error) {
        this.authenticating = false;
        this.error = true;
        this.errorMessage =
          error.response?.status === 401
            ? "Invalid username or password"
            : "Could not log in";
      } finally {
        this.authenticating = false;
      }
    },
  },
};
</script>
