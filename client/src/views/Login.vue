<template>
  <div class="col-12 col-md-6">
    <div v-if="!isAuthenticated">
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
        <button class="btn btn-chirp-red" type="submit" :disabled="authenticating">log in</button>
      </form>
      <p v-if="error" class="text-danger">{{ errorMessage }}</p>
    </div>
    <RecordSpinner v-if="showSpinner" />
  </div>
</template>

<script>
import RecordSpinner from "../components/RecordSpinner";

export default {
  components: { RecordSpinner },
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
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    showSpinner() {
      return this.isAuthenticated || this.authenticating;
    }
  },
  methods: {
    async logIn() {
      try {
        this.authenticating = true;
        this.error = false;
        await this.$store.dispatch("logIn", {
          email: this.email,
          password: this.password,
        });
        await this.$store.dispatch("getCrates");
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
