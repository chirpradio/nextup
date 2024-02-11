<template>
  <div>
    <h1>Traffic Log</h1>
    <ul class="list-group">
      <li
        v-for="entry in trafficLog"
        :key="entry.scheduled.name"
        class="list-group-item"
      >
        {{ entry.scheduled.name }} - {{ entry.spot?.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useSpotsStore } from "../store";

export default {
  computed: {
    ...mapStores(useSpotsStore),
    trafficLog() {
      const log = this.spotsStore.trafficLog;      
      return log ? log.filter((entry) => entry.spot) : [];
    },
  },
  created() {
    this.spotsStore.getTrafficLog();
  },
};
</script>
