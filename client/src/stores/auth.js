import { defineStore } from "pinia";
import { api, setAuthorizationHeader } from "../services/api.service";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import features from "./features";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: {},
    features: features[import.meta.env.MODE],
    password_reset_required: false,
    email: "",
    message: "",
    messageType: "",
  }),
  getters: {
    isAuthenticated: (state) => {
      try {
        if (state.token === "") {
          return false;
        }

        const decoded = jwt_decode(state.token);
        if (!decoded || !decoded.exp) {
          return false;
        }

        const now = new Date().getTime() / 1000;
        return decoded.exp && decoded.exp > now;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    hasRole: (state) => (role) => {
      return state.user?.roles?.includes(role);
    },
    isAuthorized: (state) => (feature) => {
      const permitted = state.features[feature];

      if (permitted?.superuser && state.user.is_superuser) {
        return true;
      } else if (permitted?.users) {
        return permitted.users.includes(state.user.email);
      } else if (permitted?.roles) {
        const commonRoles = permitted.roles.filter((role) =>
          state.user.roles.includes(role)
        );
        return commonRoles.length > 0;
      }

      return false;
    },
    canEditDocument: (state) => (document) => {
      if (!state.user || !state.isAuthenticated) {
        return false;
      }

      const isAuthor = document.author?.id === state.user.entityKey.id;
      const isMusicDirector = state.user.roles?.includes("music_director");
      const isSuperuser = state.user.is_superuser === true;

      return isAuthor || isMusicDirector || isSuperuser;
    },
    canDeleteDocument: (state) => (document) => {
      return state.canEditDocument(document);
    },
  },
  actions: {
    async logIn({ email, password }) {
      const { data } = await api.post("/token", {
        email,
        password,
      });
      if (data.password_reset_required) {
        return {
          password_reset_required: true,
          message: data.message,
          email: data.email,
        };
      } else if (data.token) {
        this.token = data.token;
        const decoded = jwt_decode(data.token);
        this.user = decoded.user;
        return { success: true };
      } else {
        console.log(response);
        return { success: false };
      }
    },
    logOut() {
      setAuthorizationHeader("");
      this.$reset();
    },
    async changePassword(currentPassword, newPassword) {
      try {
        const response = await api.post("/user/change-password", {
          email: this.user.email,
          currentPassword,
          newPassword,
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.error || "Failed to change password"
        );
      }
    },
    async updateProfile(userData) {
      this.error = null;

      const userId = this.user.entityKey.id;

      try {
        const { data } = await api.patch(`/user/${userId}`, userData);
        Object.assign(this.user, data);        
        return data;
      } catch (error) {        
        this.error = error.response?.data?.error || "Failed to update user";
        throw error;
      }
    },
  },
  persist: {
    paths: ["token", "user"],
    storage: {
      getItem: (key) => Cookies.get(key),
      setItem: (key, value) =>
        Cookies.set(key, value, {
          expires: 0.25, // = 1/4 day = six hours
          secure: false,
        }),
      removeItem: (key) => Cookies.remove(key),
    },
    afterRestore: ({ store }) => {
      if (store.isAuthenticated) {
        setAuthorizationHeader(store.token);
      }
    },
  },
});
