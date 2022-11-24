<template>
  <div class="offcanvas offcanvas-end">
    <div class="offcanvas-header">
      <div class="d-flex">
        <h2>{{ header }}</h2>
        <LoadingButton
          v-if="!selected"
          icon="rotate-right"
          label="refresh"
          :loading="loading"
          class="ms-2 mb-2"
          :small="true"
          @click="refresh"
        />
      </div>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body pt-0">
      <ul v-if="!selected" class="list-group list-group-flush">
        <li
          v-for="entry in trafficLog"
          :key="entry.scheduled.name"
          class="list-group-item d-flex"
          :class="itemClass(entry)"
        >
          <span class="col-1 pt-1">{{ time(entry) }}</span>
          <div class="col" :class="titleClass(entry)">
            {{ entry.spot.title }}
            <button
              class="btn align-baseline"
              :class="linkClass(entry)"
              @click="select(entry)"
            >
              show text
            </button>
          </div>
        </li>
      </ul>
      <div v-if="selected">
        <button class="btn btn-link-chirp-red px-0" @click="back">
          <font-awesome-icon icon="fa-arrow-left" />
          back to list
        </button>
        <p class="spot-body">{{ selected.spot_copy.body }}</p>
        <LoadingButton
          v-if="!selected.readtime"
          :loading="adding"
          icon="check"
          label="mark as read"
          @click="markAsRead"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.spot-body {
  font-size: 2.625rem;
}
</style>

<script>
import { Offcanvas } from "bootstrap"; // eslint-disable-line no-unused-vars
import { mapStores } from "pinia";
import { useSpotsStore } from "@/stores/spots";
import LoadingButton from "../LoadingButton.vue";

export default {
  components: { LoadingButton },
  data() {
    return {
      selected: null,
    };
  },
  computed: {
    ...mapStores(useSpotsStore),
    header() {
      return this.selected
        ? `${this.time(this.selected)} ${this.selected.spot.title}`
        : "Traffic Log";
    },
    loading() {
      return this.spotsStore.loadingTrafficLog;
    },
    trafficLog() {
      const log = this.spotsStore.trafficLog;
      return log ? log.filter((entry) => entry.spot) : [];
    },
    adding() {
      return this.spotsStore.addingToLog;
    },
  },
  mounted() {
    this.spotsStore.getTrafficLog();
  },
  methods: {
    time(entry) {
      const hour = entry.hour > 12 ? entry.hour - 12 : entry.hour;
      const minute = entry.slot.toString().padStart(2, "0");
      return `${hour}:${minute}`;
    },
    refresh() {
      this.spotsStore.getTrafficLog();
    },
    select(entry) {
      this.selected = entry;
    },
    back() {
      this.selected = null;
    },
    async markAsRead() {
      await this.spotsStore.addTrafficLogEntry(this.selected);
      this.back();
    },
    itemClass(entry) {
      return {
        "bg-light": entry.readtime,
      };
    },
    titleClass(entry) {
      return {
        "text-muted": entry.readtime,
      };
    },
    linkClass(entry) {
      return {
        "btn-link-chirp-red": !entry.readtime,
      };
    },
  },
};
</script>
