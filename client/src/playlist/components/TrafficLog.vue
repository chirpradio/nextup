<template>
  <div class="text-bg-light">
    <div class="d-flex">
      <h2 class="h4 flex-fill">Traffic Log</h2>
      <LoadingButton
        icon="rotate-right"
        label="refresh"
        :loading="loading"
        class="ms-2 mb-2"
        :small="true"
        @click="refresh"
      />
    </div>

    <ul class="list-group">
      <button
        v-for="entry in trafficLog"
        :key="entry.scheduled.name"
        class="list-group-item list-group-item-action list-group-item-light d-flex flex-column flex-lg-row"
        data-bs-toggle="offcanvas"
        data-bs-target="#spot"
        aria-controls="spot"
        @click="select(entry)"
      >
        <span class="w-20">{{ time(entry) }}</span>
        <div class="col" :class="titleClass(entry)">
          <font-awesome-icon icon="square-caret-left" />
          {{ entry.spot.title }}
        </div>
      </button>
    </ul>

    <aside id="spot" class="offcanvas offcanvas-end drawer">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasLabel">{{ spotHeading }}</h5>
      </div>
      <div class="offcanvas-body fs-3 fs-md-1">
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-light"
            data-bs-dismiss="offcanvas"
            aria-label="close script"
          >
            close script
          </button>
          <button
            class="btn btn-chirp-red ms-2"
            data-bs-dismiss="offcanvas"
            aria-label="mark as read"
            @click="markAsRead"
            :disabled="hasBeenRead(selected)"
          >
            <font-awesome-icon icon="check" />
            mark as read
          </button>
        </div>
        <p class="mt-2">{{ selected?.spot_copy.body }}</p>
        <div class="d-flex justify-content-end">
          <button
            class="btn btn-light"
            data-bs-dismiss="offcanvas"
            aria-label="close script"
          >
            close script
          </button>
          <button
            class="btn btn-chirp-red ms-2"
            data-bs-dismiss="offcanvas"
            aria-label="mark as read"
            @click="markAsRead"
            :disabled="hasBeenRead(selected)"
          >
            <font-awesome-icon icon="check" />
            mark as read
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { Offcanvas } from "bootstrap"; // eslint-disable-line no-unused-vars
import { mapStores } from "pinia";
import { useSpotsStore } from "@/traffic-log/store";
import LoadingButton from "@/components/LoadingButton.vue";

export default {
  components: { LoadingButton },
  data() {
    return {
      selected: null,
    };
  },
  computed: {
    ...mapStores(useSpotsStore),
    spotHeading() {
      return this.selected
        ? `${this.time(this.selected)} ${this.selected.spot.title}`
        : "";
    },
    loading() {
      return this.spotsStore.loadingTrafficLog;
    },
    trafficLog() {
      const log = this.spotsStore.trafficLog;
      return log ? log.filter((entry) => entry.spot) : [];
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
    async markAsRead() {
      await this.spotsStore.addTrafficLogEntry(this.selected);
    },
    hasBeenRead(entry) {
      return entry && entry.readtime;
    },
    titleClass(entry) {
      return {
        "text-chirp-red": !entry.readtime,
        "text-chirp-red-hover": !entry.readtime,
      };
    },
  },
};
</script>
