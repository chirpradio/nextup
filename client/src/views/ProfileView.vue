<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-6">
        <h1>Edit Your Profile</h1>

        <div v-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        
        <div v-if="isDJ" class="mt-4 mb-4">
          <h2>Update info</h2>
            <form @submit.prevent="updateInfo">
              <div class="mb-3">
                <label for="djName" class="form-label">DJ name</label>
                <input
                  type="text"
                  class="form-control"
                  id="djName"
                  v-model="infoForm.dj_name"
                  placeholder="Enter your DJ name"
                />
              </div>
              <div class="d-flex gap-2">
                <LoadingButton
                  type="submit"
                  :loading="savingInfo"
                  :disable="!djNameChanged"
                  label="update"
                  loadingLabel="updating"
                />
              </div>
            </form> 
        </div>

        <div>          
            <h2>Change password</h2>          
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="currentPassword" class="form-label">Current password</label>
                <input
                  type="password"
                  class="form-control"
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="newPassword" class="form-label">New password</label>
                <input
                  type="password"
                  class="form-control"
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  required
                  minlength="12"
                />
                <div class="form-text">
                  minimum 12 characters
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm new password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  required              
                />
              </div>

              <div class="d-flex gap-2">
                <LoadingButton
                  type="submit"
                  :loading="savingPassword"
                  label="change password"
                  loadingLabel="changing..."
                />
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click="resetPasswordForm"
                  :disabled="savingPassword"
                >
                  clear
                </button>
              </div>
            </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useAuthStore } from "../stores/auth";
import LoadingButton from "../components/LoadingButton.vue";

export default {
  name: "ProfileView",
  components: {
    LoadingButton,
  },
  data() {
    return {
      infoForm: {
        dj_name: "",
      },
      passwordForm: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      error: null,
      successMessage: null,
      savingInfo: false,
      savingPassword: false,
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    user() {
      return this.authStore.user;
    },
    isDJ() {
      return this.authStore.hasRole("dj");
    },
    djNameChanged() {
      return this.infoForm.dj_name !== (this.user.dj_name || "");
    },
  },
  mounted() {
    if (this.isDJ) {      
      this.infoForm.dj_name = this.user.dj_name || "";
    }
  },
  methods: {
    async updateInfo() {
      this.error = null;
      this.successMessage = null;
      this.savingInfo = true;

      try {
        await this.authStore.updateProfile(this.infoForm);
        this.successMessage = "Updated successfully";
      } catch (error) {
        this.error = error.message || "Failed to update";
      } finally {
        this.savingInfo = false;
      }
    },

    async changePassword() {
      this.error = null;
      this.successMessage = null;

      // Validate passwords match
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.error = "New passwords do not match";
        return;
      }

      if (this.passwordForm.newPassword.length < 12) {
        this.error = "New password must be at least 12 characters long";
        return;
      }

      this.savingPassword = true;

      try {
        await this.authStore.changePassword(
          this.passwordForm.currentPassword, 
          this.passwordForm.newPassword
        );
        this.successMessage = "Password changed successfully";
        this.resetPasswordForm();
      } catch (error) {
        this.error = error.message || "Failed to change password";
      } finally {
        this.savingPassword = false;
      }
    },
    resetPasswordForm() {
      this.passwordForm.currentPassword = "";
      this.passwordForm.newPassword = "";
      this.passwordForm.confirmPassword = "";
    },
  },
};
</script>