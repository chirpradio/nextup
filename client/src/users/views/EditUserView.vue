<template>
  <div class="container-fluid">
    <div class="d-flex flex-column flex-sm-row align-items-sm-center mb-3">
      <h1 class="flex-grow-1">Edit User</h1>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <RecordSpinner v-if="loadingUser" />

    <div v-else-if="!user" class="alert alert-danger">User not found</div>

    <UserForm
      v-else
      mode="edit"
      :user="user"
      :saving="savingUser"
      @submit="handleSubmit"
      @cancel="$router.push('/users')"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useUsersStore } from "../store";
import UserForm from "../components/UserForm.vue";
import RecordSpinner from "../../components/RecordSpinner.vue";

export default {
  name: "EditUserView",
  components: {
    UserForm,
    RecordSpinner,
  },
  props: {
    id: String,
  },
  computed: {
    ...mapState(useUsersStore, [
      "users",
      "getUserById",
      "loadingUsers",
      "savingUser",
      "error",
    ]),
    user() {
      return this.getUserById(this.id);
    },
    loadingUser() {
      return this.loadingUsers && !this.user;
    },
  },
  methods: {
    ...mapActions(useUsersStore, ["getUsers", "updateUser", "clearError"]),

    async handleSubmit(formData) {
      try {
        await this.updateUser(this.id, formData);
        this.$router.push("/users");
      } catch (error) {
        // Error is handled by the store
        console.error("Failed to update user:", error);
      }
    },
  },

  async created() {
    this.clearError();

    // Load users if not already loaded or if specific user not found
    if (!this.user) {
      try {
        await this.getUsers(true); // Force refresh
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    }
  },

  beforeUnmount() {
    this.clearError();
  },
};
</script>
