import api from "../../services/api.service";
import jwt_decode from "jwt-decode";

const state = () => ({
  token: "",
  user: {},
  features: {
    crates: {
      users: [
        "billykalb@gmail.com",
        "lund5000@gmail.com",
        "mike@nikolich.com",
        "tony@chirpradio.org",
        "jenn@chirpradio.org",
        "buesary@gmail.com",
      ],
    },
  },
});

const getters = {
  isAuthenticated: (state) => {
    try {
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
  isAuthorized: (state) => (feature) => {
    return state.features[feature]?.users?.includes(state.user.email);
  },
};

const actions = {
  async logIn({ commit }, { email, password }) {
    const response = await api.login(email, password);
    if (response.token) {
      commit("token", response.token);
      const decoded = jwt_decode(response.token);
      commit("user", decoded.user);
    } else {
      console.log(response);
    }
  },
  logOut({ commit }) {
    commit("token", "");
    commit("user", {});
  },
};

const mutations = {
  token(state, token) {
    state.token = token;
  },
  user(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
