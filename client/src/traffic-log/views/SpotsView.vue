<template>
  <div class="px-3">
    <RecordSpinner v-if="loading" />
    <div v-if="!loading" class="py-2">
      <div class="row">
        <div class="col-8 pe-3 border-end">
          <h1>Spots</h1>
          <div
            class="row mt-4 mx-1 px-0 py-2 border-top border-bottom"
          >
            <div class="col-12 col-lg-2 ps-0 font-sans fs-5">Filters</div>
            <div class="col-12 col-lg-2 ps-0 mt-3 mt-lg-0">
              <label class="form-label">Type</label>
              <select class="form-select form-select-sm" v-model="typeFilter">
                <option value="">All</option>
                <option v-for="opt in types" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </div>
            <div class="col-12 col-lg-2 ps-0 ps-lg-3 mt-3 mt-lg-0">
              <label class="form-label">Copy</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="futureCopy"
                  v-model="futureCopy"
                />
                <label class="form-check-label" for="futureCopy">
                  Future
                </label>
              </div>
            </div>
          </div>
          <div
            class="row d-none d-lg-flex mt-4 font-sans fw-bold border-bottom"
          >
            <div class="col-2">Title</div>
            <div class="col-2">Type</div>
            <div class="col-8">Copy</div>
          </div>
          <div
            v-for="spot in spots"
            :key="spot.id"
            class="row border-bottom py-3"
          >
            <div class="col-12 col-lg-2">
              <router-link
                :to="{ name: 'editSpot', params: { spotId: spot.id } }"
              >
                {{ spot.title }}
              </router-link>
            </div>
            <div class="col-12 col-lg-2">{{ spot.type }}</div>
            <div class="col-12 col-lg-8 mt-3 mt-lg-0">
              <SpotCopyList
                :spot="spot"
                ref="lists"
                @select="onSelect"
                :future="futureCopy"
              />
            </div>
          </div>
        </div>
        <div class="col-4 p-3">
          <router-link
            :to="{ name: 'addSpot' }"
            class="btn btn-chirp-red w-100 mb-5"
            >Add a new spot</router-link
          >
          <h3>Bulk Actions</h3>
          <SpotCopyBulkActions
            ref="bulkActions"
            class="px-3"
            @bulk-update="onBulkUpdate"
            :count="selectedCopy.length"
            :updating-copy="updatingCopy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecordSpinner from "../../components/RecordSpinner.vue";
import SpotCopyList from "../components/SpotCopyList.vue";
import { mapStores } from "pinia";
import { useSpotsStore } from "../store";
import SpotCopyBulkActions from "../components/SpotCopyBulkActions.vue";
import { types } from "../constants";

export default {
  components: { RecordSpinner, SpotCopyList, SpotCopyBulkActions },
  data() {
    return {
      selections: {},
      typeFilter: "",
      updatingCopy: false,
      types,
      futureCopy: false,
    };
  },
  computed: {
    ...mapStores(useSpotsStore),
    loading() {
      return this.spotsStore.loadingSpots;
    },
    spots() {
      if (this.typeFilter) {
        return this.spotsStore.spots.filter(
          (spot) => spot.type === this.typeFilter
        );
      }
      return this.spotsStore.spots;
    },
    selectedCopy() {
      return Object.values(this.selections).flat();
    },
  },
  created() {
    if (!this.spotsStore.loadedSpots) {
      this.spotsStore.getSpots();
    }
  },
  methods: {
    onSelect(event) {
      Object.assign(this.selections, event);
    },
    async onBulkUpdate(event) {
      const store = this.spotsStore;
      let promises;

      this.updatingCopy = true;
      if (!event.deleteCopy) {
        delete event.deleteCopy;
        promises = this.selectedCopy.map(async function (copy) {
          return await store.updateCopy({
            copy,
            body: event,
          });
        });
      } else {
        promises = this.selectedCopy.map(async function (copy) {
          return await store.deleteCopy(copy);
        });
      }

      await Promise.all(promises);
      this.updatingCopy = false;
      this.$refs.lists.forEach((list) => list.clearAll());
      this.$refs.bulkActions.reset();
    },
  },
};
</script>
