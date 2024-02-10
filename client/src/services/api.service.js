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
    console.log(error.response.data);
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
    const response = await instance.patch(`/album/${album_id.value}`, { tags });
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

  async getCrates() {
    const getter = instance.get("/crate");
    return await getAndHandleError(getter);
  },

  async getCrate(crateId) {
    const getter = instance.get(`/crate/${crateId}`);
    return await getAndHandleError(getter);
  },

  async getCrateItems(crateId) {
    const getter = instance.get(`/crate/${crateId}/items`);
    return await getAndHandleError(getter);
  },

  async addToCrate(crateId, params) {
    const response = await instance.post(`/crate/${crateId}/item`, params);
    return response.data;
  },

  async removeFromCrate(crateId, index) {
    await instance.delete(`crate/${crateId}/item/${index}`);
  },

  async reorderItemInCrate(crateId, index, newIndex) {
    await instance.patch(`/crate/${crateId}/item/${index}/reorder/${newIndex}`);
  },

  async addCrate(name) {
    return await instance.post(`/crate/`, {
      name,
    });
  },

  async renameCrate(crateId, name) {
    await instance.patch(`/crate/${crateId}`, {
      name,
    });
  },

  async deleteCrate(crateId) {
    await instance.delete(`/crate/${crateId}`);
  },

  async getPlaylistEvents({ start, end } = {}) {
    const options = {};
    if (start || end) {
      const params = {};
      if (start) {
        params.start = start;
      }
      if (end) {
        params.end = end;
      }
      options.params = params;
    }

    return await instance.get("/playlist", options);
  },

  async addPlaylistTrack(data) {
    const response = await instance.post("/playlist/track", data);
    return response.data;
  },

  async addFreeformPlaylistTrack(data) {
    const response = await instance.post("/playlist/freeform", data);
    return response.data;
  },

  async addBreak() {
    const response = await instance.post("/playlist/break");
    return response.data;
  },

  async getRotationPlays(params) {
    const getter = instance.get("/playlist/rotation", { params });
    return await getAndHandleError(getter);
  },

  async search(params) {
    const getter = instance.get("/search", {
      params,
    });
    return await getAndHandleError(getter);
  },

  async deleteSpot(spotId) {
    await instance.delete(`/spot/${spotId}`);
  },

  async deleteCopy(copyId) {
    await instance.delete(`/spot/copy/${copyId}`);
  },

  async getTrafficLog() {
    const getter = instance.get("/traffic-log");
    return await getAndHandleError(getter);
  },

  async addTrafficLogEntry(data) {
    await instance.post("/traffic-log", data);
  },
};
