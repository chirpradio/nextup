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
        class="list-group-item list-group-item-action list-group-item-light d-flex flex-row flex-md-column flex-lg-row"
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

    <aside id="spot" ref="spot" class="offcanvas offcanvas-end drawer">
      <div class="offcanvas-header d-flex align-items-center">
        <h5 class="offcanvas-title flex-grow-1" id="offcanvasLabel">
          {{ spotHeading(selected) }}
        </h5>
        <span v-if="selectedGroup" class="h5 mb-0 me-2">
          {{ ordinal }} of {{ selectedGroup.length }} spots
        </span>
      </div>
      <div class="offcanvas-body fs-3 fs-md-1">
        <TrafficLogActions
          :previous="previousInGroup"
          :next="nextInGroup"
          :has-been-read="hasBeenRead(selected)"
          @close="close"
          @previous="previous"
          @next="next"
          @mark-as-read="markAsRead"
        ></TrafficLogActions>
        <p class="mt-2 mb-5">{{ selected?.spot_copy.body }}</p>
        <TrafficLogActions
          :previous="previousInGroup"
          :next="nextInGroup"
          :has-been-read="hasBeenRead(selected)"
          @close="close"
          @previous="previous"
          @next="next"
          @mark-as-read="markAsRead"
        ></TrafficLogActions>
        <div class="font-sans fs-6">
          <div v-if="previousInGroup">
            Previous spot: {{ spotHeading(previousInGroup) }} ({{
              readLabel(previousInGroup)
            }})
          </div>
          <div v-if="nextInGroup">
            Next spot: {{ spotHeading(nextInGroup) }} ({{
              readLabel(nextInGroup)
            }})
          </div>
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
import TrafficLogActions from "./TrafficLogActions.vue";

export default {
  components: { LoadingButton, TrafficLogActions },
  data() {
    return {
      drawer: undefined,
      selected: null,
    };
  },
  computed: {
    ...mapStores(useSpotsStore),
    loading() {
      return this.spotsStore.loadingTrafficLog;
    },
    trafficLog() {
      return this.spotsStore.trafficLog;
    },
    selectedGroup() {
      return this.spotsStore.group(this.selected);
    },
    selectedIndexInGroup() {
      return this.selectedGroup?.indexOf(this.selected);
    },
    previousInGroup() {
      return this.selectedGroup
        ? this.selectedGroup[this.selectedIndexInGroup - 1]
        : undefined;
    },
    nextInGroup() {
      return this.selectedGroup
        ? this.selectedGroup[this.selectedIndexInGroup + 1]
        : undefined;
    },
    ordinal() {
      switch (this.selectedIndexInGroup) {
        case 0:
          return "1st";
        case 1:
          return "2nd";
        case 2:
          return "3rd";
        default:
          return `${this.selectedIndexInGroup}th`;
      }
    },
  },
  mounted() {
    this.spotsStore.getTrafficLog();
    this.drawer = new Offcanvas(this.$refs.spot);
  },
  methods: {
    time(entry) {
      const hour = entry.hour > 12 ? entry.hour - 12 : entry.hour;
      const minute = entry.slot.toString().padStart(2, "0");
      return `${hour}:${minute}`;
    },
    spotHeading(entry) {
      if (!entry) {
        return "";
      }

      return `${this.time(entry)} ${entry.spot.title}`;
    },
    refresh() {
      this.spotsStore.getTrafficLog();
    },
    select(entry) {
      this.selected = entry;
    },
    close() {
      this.drawer.hide();
    },
    previous() {
      this.selected = this.previousInGroup;
    },
    next() {
      this.selected = this.nextInGroup;
    },
    async markAsRead() {
      await this.spotsStore.addTrafficLogEntry(this.selected);
      if (this.nextInGroup) {
        this.next();
      } else {
        this.close();
      }
    },
    hasBeenRead(entry) {
      return entry && entry.readtime;
    },
    readLabel(entry) {
      return this.hasBeenRead(entry) ? "read" : "unread";
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
