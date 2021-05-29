import { createStore, createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Cookies from 'js-cookie';
import auth from './modules/auth';
import albums from './modules/albums';
import artists from './modules/artists';
import crates from './modules/crates';
import search from './modules/search';
import api from '../services/api.service';

const DAYS_BEFORE_TOKEN_EXPIRES = 0.25;

const persistTokenInCookies = createPersistedState({
  paths: ['auth.token'],
  storage: {
    getItem: key => Cookies.get(key),
    setItem: (key, value) => Cookies.set(key, value, { expires: DAYS_BEFORE_TOKEN_EXPIRES, secure: false }),
    removeItem: key => Cookies.remove(key)
  },
  rehydrated: store => {
    if(store.getters.isAuthenticated) {
      api.setAuthorizatonHeader(store.state.auth.token);
    }    
  },
});

const persistCratesInLocalStorage = createPersistedState({
  paths: ['crates.crates', 'auth.user'],
});

export default createStore({
  plugins: [persistTokenInCookies, persistCratesInLocalStorage, createLogger()],
  modules: {
    auth,
    albums,
    artists,
    crates,
    search,
  },
});
