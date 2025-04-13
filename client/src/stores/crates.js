import { defineStore } from "pinia";
import { api } from "../services/api.service";
import { useAuthStore } from "./auth";
import { watch, ref, computed } from "vue";
import { storeToRefs } from "pinia";

export const useCratesStore = defineStore(
  "crates",
  () => {
    // state
    const crates = ref([]);
    const items = ref({});
    const loadingCrates = ref(false);
    const lastAddedTo = ref();

    function findCrate(crateId) {
      return crates.value.find((crate) => crate.id === crateId);
    }

    function sortCrates(crates) {
      crates.value.sort((a, b) => {
        if (a.name === b.name || !a.name || !b.name) {
          return 0;
        }
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      });
    }

    // getters
    const crate = computed(() => (id) => {
      return findCrate(id);
    });

    const crateItems = computed(() => (id) => {
      return items.value[id];
    });

    // actions
    async function getCrates() {
      loadingCrates.value = true;
      const response = await api.get("/crate");
      crates.value = response.data;
      sortCrates(crates);
      loadingCrates.value = false;
    }

    async function getCrate({ crateId }) {
      loadingCrates.value = true;
      const { data: crate } = await api.get(`/crate/${crateId}`);
      items.value[crateId] = [];
      crate.order = crate.order || [];
      crates.value.push(crate);
      loadingCrates.value = false;
    }

    async function addCrate({ name }) {
      const { data: crate } = await api.post(`/crate/`, { name });
      crates.value.push(crate);
      sortCrates(crates);
      return crate;
    }

    async function renameCrate({ crateId, name }) {
      await api.patch(`/crate/${crateId}`, {
        name,
      });
      const crate = findCrate(crateId);
      crate.name = name;
    }

    async function deleteCrate({ crateId }) {
      const index = crates.value.findIndex((element) => element.id === crateId);
      crates.value.splice(index, 1);
      await api.delete(`/crate/${crateId}`);
    }

    async function getCrateItems({ crateId }) {
      const { data: loadedItems } = await api.get(`/crate/${crateId}/items`);
      items.value[crateId] = loadedItems;
    }

    async function addToCrate({ crateId, params }) {
      const { data: loadedItems } = await api.post(
        `/crate/${crateId}/item`,
        params
      );
      items.value[crateId] = loadedItems;

      const crate = findCrate(crateId);
      crate.totalItems++;
      lastAddedTo.value = crate;
    }

    async function removeItem({ crateId, index }) {
      const crate = findCrate(crateId);
      items.value[crateId].splice(index, 1);
      crate.totalItems--;
      await api.delete(`crate/${crateId}/item/${index}`);
    }

    async function reorderItem({ crateId, index, newIndex }) {
      await api.patch(`/crate/${crateId}/item/${index}/reorder/${newIndex}`);
    }

    // load crates for user
    const auth = useAuthStore();
    const { isAuthenticated } = storeToRefs(auth);
    if (isAuthenticated.value === true) {
      getCrates();
    }
    watch(isAuthenticated, (value) => {
      if (value === true) {
        getCrates();
      } else {
        lastAddedTo.value = null;
      }
    });

    return {
      // state
      crates,
      items,
      loadingCrates,
      lastAddedTo,
      // getters
      crate,
      crateItems,
      // actions
      getCrates,
      getCrate,
      addCrate,
      renameCrate,
      deleteCrate,
      getCrateItems,
      addToCrate,
      removeItem,
      reorderItem,
    };
  },
  {
    persist: {
      paths: ["lastAddedTo"],
    },
  }
);
