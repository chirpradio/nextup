import { defineStore } from "pinia";
import api from "../services/api.service";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: {},
    features: {
      /**
       * template: {
       *   users: [],
       *   roles: [],
       **/
      playlist: {
        users: [
          "tony@chirpradio.org",
          "jennamlchapman@gmail.com",
          "alexarchibeque0024@gmail.com",
          "buesary@gmail.com",
          "chris.r.siuty@gmail.com",
          "cornelia.q.smith@gmail.com",
          "craigb@chirpradio.org",
          "griffimichael@gmail.com",
          "jenn@chirpradio.org",
          "kevinshields101@hotmail.com",
          "mike@nikolich.com",
          "namowhammo@yahoo.com",
          "scott@chirpradio.org",
          "studio@joslinlakedesign.com",
          "mattbarr1516@yahoo.com",
          "pigface13@yahoo.com",
        ],
      },
      "traffic-log": {
        roles: ["traffic_log_admin"],
      },
    },
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

      if (permitted?.users) {
        return permitted.users.includes(state.user.email);
      } else if (permitted?.roles) {
        const commonRoles = permitted.roles.filter((role) =>
          state.user.roles.includes(role)
        );
        return commonRoles.length > 0;
      }

      return false;
    },
  },
  actions: {
    async logIn({ email, password }) {
      const response = await api.login(email, password);
      if (response.token) {
        this.token = response.token;
        const decoded = jwt_decode(response.token);
        this.user = decoded.user;
      } else {
        console.log(response);
      }
    },
    logOut() {
      this.$reset();
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
        api.setAuthorizationHeader(store.token);
      }
    },
  },
});
