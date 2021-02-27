import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Cookies from 'js-cookie';

const DAYS_BEFORE_TOKEN_EXPIRES = 0.25;

const persistTokenInCookies = createPersistedState({
  paths: ['token'],
  storage: {
    getItem: key => Cookies.get(key),
    setItem: (key, value) => Cookies.set(key, value, { expires: DAYS_BEFORE_TOKEN_EXPIRES, secure: false }),
    removeItem: key => Cookies.remove(key)
  }
});

const persistCratesAndUserInLocalStorage = createPersistedState({
  paths: ['crates', 'user']
});

export default createStore({
  state: {
    crates: [],
    token: '',
    user: {},
  },
  plugins: [persistTokenInCookies, persistCratesAndUserInLocalStorage],
  mutations: {
    crates (state, crates) {
      state.crates = crates;      
    },
    token (state, token) {
      state.token = token;
    },
    user (state, user) {
      state.user = user;
    }
  },
  actions: {
  },
  modules: {
  }
});
