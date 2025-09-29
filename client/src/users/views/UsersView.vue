<template>
  <div class="container-fluid">
    <div class="d-flex flex-column flex-sm-row align-items-sm-center mb-3">
      <h1 class="flex-grow-1">Users</h1>
      <router-link class="btn btn-chirp-red" to="/users/add">
        add new user
      </router-link>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div
      v-if="showSuccessMessage && createdUser && temporaryPassword"
      class="alert alert-success alert-dismissible"
      role="alert"
    >
      <button
        type="button"
        class="btn-close"
        @click="clearSuccessMessage"
        aria-label="Close"
      ></button>
      <h2 class="h5">User created successfully!</h2>
      <p><span class="fw-bold">Email:</span> {{ createdUser.email }}</p>
      <p>
        <span class="fw-bold">Temporary password: </span>
        <code>{{ temporaryPassword }}</code>
      </p>
      <p class="mb-0">
        Please provide this password to the user so they can log in.
      </p>
      <div class="mt-2">
        <button class="btn btn-sm btn-outline-success" @click="copyPassword">
          <font-awesome-icon icon="clipboard" />
          copy password
        </button>
      </div>
    </div>

    <RecordSpinner v-if="loadingUsers" />

    <div v-else-if="users.length === 0" class="alert alert-info">
      No users found.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>DJ Name</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.__key?.path?.join('/')">
            <td>{{ user.first_name }} {{ user.last_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.dj_name || "-" }}</td>
            <td>
              <span
                class="badge bg-secondary me-1"
                v-for="role in user.roles"
                :key="role"
              >
                {{ formatRole(role) }}
              </span>
            </td>
            <td>
              <span
                :class="user.is_active ? 'badge bg-success' : 'badge bg-danger'"
              >
                {{ user.is_active ? "Active" : "Inactive" }}
              </span>
            </td>
            <td>
              <router-link
                :to="`/users/${getUserId(user)}/edit`"
                class="btn btn-sm btn-outline-primary"
              >
                <font-awesome-icon icon="edit" />
                edit
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useUsersStore } from "../store";
import RecordSpinner from "../../components/RecordSpinner.vue";

export default {
  name: "UsersView",
  components: {
    RecordSpinner,
  },
  computed: {
    ...mapState(useUsersStore, [
      "users",
      "loadingUsers",
      "error",
      "showSuccessMessage",
      "createdUser",
      "temporaryPassword",
    ]),
  },
  methods: {
    ...mapActions(useUsersStore, [
      "getUsers",
      "clearError",
      "clearSuccessMessage",
    ]),

    formatRole(role) {
      const roleMap = {
        dj: "DJ",
        music_director: "Music Director",
        traffic_log_admin: "Traffic Log Admin",
        reviewer: "Reviewer",
        volunteer_coordinator: "Volunteer Coordinator",
      };
      return roleMap[role] || role;
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString();
    },

    async copyPassword() {
      try {
        await navigator.clipboard.writeText(this.temporaryPassword);
      } catch (err) {
        console.error("Failed to copy password:", err);
      }
    },

    getUserId(user) {
      // Extract user ID from __key path
      return user.__key?.path?.[1] || user.id;
    },
  },

  async mounted() {
    try {
      await this.getUsers();
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  },

  beforeUnmount() {
    this.clearError();
  },
};
</script>
