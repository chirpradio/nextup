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
        <div class="mb-3">
          <label for="password">Password</label>
          <input
            id="password"
            class="form-control"
            v-model="password"
            type="password"
            required
          />
        </div>
        <button class="btn btn-chirp-red" type="submit">log in</button>
      </form>
      <p v-if="error" class="text-danger">{{ errorMessage }}</p>
    </div>
    <RecordSpinner v-if="isAuthenticated" />
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
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    async logIn() {
      try {
        this.error = false;
        await this.$store.dispatch("logIn", {
          email: this.email,
          password: this.password,
        });
        await this.$store.dispatch("getCrates");
        this.$router.push(this.$route.query.redirect || "/");
      } catch (error) {
        this.error = true;
        switch (error.response.status) {
          case 400:
            this.errorMessage = "Invalid username or password";
            break;
          default:
            this.errorMessage = "Could not log in";
        }
      }
    },
  },
};
</script>
