import axios from "axios";
import qs from "qs";
import router from "../router";
import store from "../store";

const instance = axios.create({
  baseURL: "http://localhost:1071/api",
});

function setAuthorizatonHeader(token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error.response.data);
    if (error.response.status === 401) {
      store.dispatch("logOut");
      router.push({
        name: "Log In",
        query: {
          redirect: `${window.location.pathname}${window.location.search}`,
        },
      });
    }
    return Promise.reject(error);
  }
);

async function getAndHandleError(getter) {
  try {
    const response = await getter;
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default {
  async login(email, password) {
    const response = await instance.post("/token", {
      email,
      password,
    });

    if (response.data.token) {
      setAuthorizatonHeader(response.data.token);
    }
    return response.data;
  },

  setAuthorizatonHeader,

  async getTaggedAlbums(params) {
    const getter = instance.get("/album/tag", { params });
    return await getAndHandleError(getter);
  },

  async getRecentAlbums(params) {
    const getter = instance.get("/album/recent", { params });
    return await getAndHandleError(getter);
  },

  async getAlbum(id) {
    const getter = instance.get(`/album/${id}`);
    return await getAndHandleError(getter);
  },

  async getArtist(id) {
    const getter = instance.get(`/artist/${id}`);
    return await getAndHandleError(getter);
  },

  async getArtistAlbums(id) {
    const getter = instance.get(`/artist/${id}/albums`);
    return await getAndHandleError(getter);
  },

  async getCrates() {
    const getter = instance.get("/crate");
    return await getAndHandleError(getter);
  },

  async addToCrate(crateId, path) {
    await instance.post(`/crate/${crateId}/item`, {
      path,
    });
  },

  async search(params) {
    const getter = instance.get(`/search`, {
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: "brackets" });
      },
    });
    return await getAndHandleError(getter);
  },
};
