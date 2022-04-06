import { createStore, createLogger } from "vuex";
import createPersistedState from "vuex-persistedstate";
import Cookies from "js-cookie";
import auth from "./modules/auth";
import albums from "./modules/albums";
import artists from "./modules/artists";
import crates from "./modules/crates";
import playlist from "./modules/playlist";
import search from "./modules/search";
import api from "../services/api.service";

const DAYS_BEFORE_TOKEN_EXPIRES = 0.25;

const persistTokenInCookies = createPersistedState({
  paths: ["auth.token"],
  storage: {
    getItem: (key) => Cookies.get(key),
    setItem: (key, value) =>
      Cookies.set(key, value, {
        expires: DAYS_BEFORE_TOKEN_EXPIRES,
        secure: false,
      }),
    removeItem: (key) => Cookies.remove(key),
  },
  rehydrated: async function (store) {
    if (store.getters.isAuthenticated) {
      api.setAuthorizationHeader(store.state.auth.token);
      await store.dispatch("getCrates");
    }
  },
});

const persistPathsInLocalStorage = createPersistedState({
  paths: ["auth.user", "crates.lastAddedTo", "playlist.onAir"],
});

const plugins = [persistTokenInCookies, persistPathsInLocalStorage];
const debug = process.env.NODE_ENV !== "production";
if (debug) {
  plugins.push(createLogger());
}

export default createStore({
  plugins,
  modules: {
    auth,
    albums,
    artists,
    crates,
    playlist,
    search,
  },
});
