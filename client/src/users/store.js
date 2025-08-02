import { defineStore } from "pinia";
import { api } from "../services/api.service";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    loadingUsers: false,
    savingUser: false,
    createdUser: null,
    temporaryPassword: null,
    error: null,
    showSuccessMessage: false,
  }),
  getters: {
    user: (state) => (id) => {
      return state.users.find(user => user.id === id);
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
        this.savingUser = false;
        return data;
      } catch (error) {
        this.savingUser = false;
        this.error = error.response?.data?.error || "Failed to create user";
        throw error;
      }
    },

    async getUsers() {
      this.loadingUsers = true;
      this.error = null;
      try {
        const { data: users } = await api.get("/user");
        this.users = users;
        this.loadingUsers = false;
      } catch (error) {
        this.loadingUsers = false;
        this.error = error.response?.data?.error || "Failed to load users";
        throw error;
      }
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
    }
  }
});