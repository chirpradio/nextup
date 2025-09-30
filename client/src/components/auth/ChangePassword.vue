<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h1 class="card-title mb-4">Change password</h1>

            <div
              v-if="password_reset_required"
              class="alert alert-warning"
              role="alert"
            >
              You must change your password before logging in.
            </div>
            <div v-if="message" class="alert alert-success" role="alert">
              {{ message }}
            </div>

            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label"
                  >Current password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="currentPassword"
                  v-model="currentPassword"
                  required
                  :disabled="loading"
                  placeholder="Enter your current password"
                />
              </div>

              <div class="mb-3">
                <label for="newPassword" class="form-label">New password</label>
                <input
                  type="password"
                  class="form-control"
                  id="newPassword"
                  v-model="newPassword"
                  required
                  :disabled="loading"
                  minlength="12"
                />
                <div class="form-text">
                  Password must be at least 12 characters long.
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label"
                  >Confirm new password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                  :disabled="loading"
                  :class="{ 'is-invalid': passwordMismatch }"
                />
                <div v-if="passwordMismatch" class="invalid-feedback">
                  Passwords do not match.
                </div>
              </div>

              <div class="d-grid">
                <LoadingButton
                  type="submit"
                  :loading="loading"
                  :disabled="passwordMismatch || !formValid"
                  class="btn-primary"
                  label="change password"
                  icon="key"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingButton from "../LoadingButton.vue";
import { api } from "../../services/api.service";
import { mapState, mapStores } from "pinia";
import { useAuthStore } from "@/stores/auth";
import routeNames from "@/router/names";

export default {
  name: "ChangePassword",
  components: {
    LoadingButton,
  },
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      loading: false,
      message: "",
      error: "",
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    ...mapState(useAuthStore, ["password_reset_required", "email"]),
    passwordMismatch() {
      return (
        this.confirmPassword.length > 0 &&
        this.newPassword !== this.confirmPassword
      );
    },
    formValid() {
      return (
        this.currentPassword.length > 0 &&
        this.newPassword.length >= 12 &&
        this.confirmPassword.length > 0 &&
        !this.passwordMismatch
      );
    },
  },
  methods: {
    async changePassword() {
      this.loading = true;
      this.error = "";
      this.message = "";

      try {
        const response = await api.post("/user/change-password", {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          email: this.email,
        });

        this.message = response.data.message;

        this.authStore.message =
          "You changed your password and now you can use it to log in.";
        this.authStore.messageType = "success";
        this.authStore.password_reset_required = false;
        this.authStore.email = undefined;
        this.$router.push({ name: routeNames.LOG_IN });
      } catch (error) {
        this.error = error.response?.data?.error || "Failed to change password";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
