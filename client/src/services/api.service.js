import axios from "axios";
import router from "../router";
import { useAuthStore } from "../stores/auth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function setAuthorizationHeader(token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.dir(error.response);
    if (error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logOut();
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
  const response = await getter;
  return response.data;
}

export { instance as api };

export default {
  async login(email, password) {
    const response = await instance.post("/token", {
      email,
      password,
    });

    if (response.data.token) {
      setAuthorizationHeader(response.data.token);
    }
    return response.data;
  },

  setAuthorizationHeader,

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

  async updateTrackTags(album_id, track_num, tags) {
    const response = await instance.patch(
      `/album/${album_id.value}/track/${track_num}`,
      { tags }
    );
    return response.data;
  },

  async updateAlbumTags(album_id, tags) {
    const response = await instance.patch(`/album/${album_id.value}/tags`, { tags });
    return response.data;
  },

  async updateAlbumInfo(album_id, { label, year, pronunciation }) {
    const response = await instance.patch(`/album/${album_id.value}/info`, {
      label,
      year,
      pronunciation,
    });
    return response.data;
  },

  async getArtist(id) {
    const getter = instance.get(`/artist/${id}`);
    return await getAndHandleError(getter);
  },

  async getArtistAlbums(id) {
    const getter = instance.get(`/artist/${id}/albums`);
    return await getAndHandleError(getter);
  },

  async search(params) {
    const getter = instance.get("/search", {
      params,
    });
    return await getAndHandleError(getter);
  },
};
