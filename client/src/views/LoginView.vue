<template>
  <div class="col-12 col-md-6">
    <h2>Log in to NextUp</h2>
    <p class="text-muted" v-if="$route.query.redirect">
      You need to log in first.
    </p>
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
import { mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";

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
  },
  methods: {
    async logIn() {
      try {
        this.authenticating = true;
        this.error = false;
        await this.authStore.logIn({
          email: this.email,
          password: this.password,
        });
        this.$router.push(this.$route.query.redirect || "/");
      } catch (error) {
        this.authenticating = false;
        this.error = true;
        this.errorMessage =
          error.response.status === 400
            ? "Invalid username or password"
            : "Could not log in";
      }
    },
  },
};
</script>
