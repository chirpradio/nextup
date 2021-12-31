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
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const trafficLog = computed(() => {
      const log = store.getters["spots/trafficLog"];
      return log ? log.filter((entry) => entry.spot) : [];
    });

    onMounted(() => {
      store.dispatch("spots/getTrafficLog");
    });

    return {
      trafficLog,
    };
  },
};
</script>
