import { defineStore } from "pinia";
import { api } from "../services/api.service";
import { useAuthStore } from "../stores/auth";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    loadingUsers: false,
    savingUser: false,
    createdUser: null,
    temporaryPassword: null,
    error: null,
    showSuccessMessage: false,
    usersLoaded: false,
  }),
  getters: {
    getUserById: (state) => (id) => {
      return state.users.find((user) => user.__key.id == id);
    },
  },
  actions: {
    async createUser(userData) {
      this.savingUser = true;
      this.error = null;
      try {
        const { data } = await api.post("/user", userData);
        this.createdUser = data.user;
        this.temporaryPassword = data.temporary_password;
        this.users.push(data.user);
        this.users = this.sortUsers(this.users);
        this.savingUser = false;
        return data;
      } catch (error) {
        this.savingUser = false;
        this.error = error.response?.data?.error || "Failed to create user";
        throw error;
      }
    },

    async getUsers(force = false) {
      // Skip loading if users are already loaded and force is not true
      if (this.usersLoaded && !force) {
        return;
      }

      this.loadingUsers = true;
      this.error = null;
      try {
        const { data: users } = await api.get("/user");
        this.users = this.sortUsers(users);
        this.usersLoaded = true;
        this.loadingUsers = false;
      } catch (error) {
        this.loadingUsers = false;
        this.error = error.response?.data?.error || "Failed to load users";
        throw error;
      }
    },

    sortUsers(users) {
      return users.sort((a, b) => {
        // Sort by active status first (active users first)
        if (a.is_active !== b.is_active) {
          return b.is_active - a.is_active; // true (1) comes before false (0)
        }

        // Then sort by last name (ascending)
        const lastNameA = (a.last_name || "").toLowerCase();
        const lastNameB = (b.last_name || "").toLowerCase();

        return lastNameA.localeCompare(lastNameB);
      });
    },

    clearTemporaryPassword() {
      this.temporaryPassword = null;
      this.createdUser = null;
    },

    clearError() {
      this.error = null;
    },

    setSuccessMessage(show = true) {
      this.showSuccessMessage = show;
    },

    clearSuccessMessage() {
      this.showSuccessMessage = false;
      this.temporaryPassword = null;
      this.createdUser = null;
    },

    refreshUsers() {
      return this.getUsers(true);
    },

    async updateUser(userId, userData) {
      this.savingUser = true;
      this.error = null;

      try {
        const { data } = await api.patch(`/user/${userId}`, userData);

        // Update the user in the users list
        const user = this.getUserById(userId);
        Object.assign(user, data);

        // Check if the updated user is the currently authenticated user
        const authStore = useAuthStore();
        if (authStore.user && authStore.user.entityKey.id == userId) {
          // Update the auth store with the new user data
          authStore.updateUserData(data);
        }

        this.savingUser = false;
        return data;
      } catch (error) {
        this.savingUser = false;
        this.error = error.response?.data?.error || "Failed to update user";
        throw error;
      }
    },

    resetUsersCache() {
      this.usersLoaded = false;
      this.users = [];
    },

    updateUserInStore(userId, userData) {
      const user = this.getUserById(userId);
      if (user) {
        Object.assign(user, userData);
      }
    },
  },
});
