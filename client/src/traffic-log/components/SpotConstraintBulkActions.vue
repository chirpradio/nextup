<template>
  <form ref="form" novalidate>
    <fieldset class="mt-3">
      <div v-for="option in dayOptions" :key="option.day" class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="option.selected"
          :id="option.id"
        />
        <label class="form-check-label" :for="option.id">
          {{ option.day }}
        </label>
      </div>
    </fieldset>
    <fieldset class="mt-5">
      <div v-for="(option, key) in hourOptions" :key="key" class="form-check">
        <input
          class="form-check-input"
          type="radio"
          v-model="bulkHours"
          :value="key"
          :id="key"
          required
        />
        <label class="form-check-label" :for="key">
          {{ option.label }}
        </label>
      </div>
    </fieldset>
    <button
      class="btn btn-outline-chirp-red mt-5"
      :disabled="disableAddButton"
      @click.prevent="onAdd"
    >
      Add to schedule
    </button>
  </form>
</template>

<script>
import { days, hours } from "../constants";

const BULK_ADD = "bulkAdd";
const hourOptions = {
  everyHour: {
    label: "Every hour",
    values: hours,
  },
  evenHours: {
    label: "Even hours",
    values: hours.filter((h) => h % 2 === 0),
  },
  oddHours: {
    label: "Odd hours",
    values: hours.filter((h) => h % 2 === 1),
  },
  everyThreeHours: {
    label: "Every three hours",
    values: hours.filter((h) => h % 3 === 0),
  },
  everySixHours: {
    label: "Every six hours",
    values: hours.filter((h) => h % 6 === 0),
  },
};

export default {
  data() {
    const dayOptions = [];
    for (const [key, value] of Object.entries(days)) {
      dayOptions.push({
        day: key,
        id: `${key}Check`,
        dow: value,
        selected: false,
      });
    }

    return {
      dayOptions,
      hourOptions,
      bulkHours: "",
    };
  },
  computed: {
    disableAddButton() {
      return !this.bulkHours || !this.dayOptions.some((d) => d.selected);
    },
  },
  emits: [BULK_ADD],
  methods: {
    onAdd() {
      this.$emit(BULK_ADD, {
        weekdays: this.dayOptions.filter((d) => d.selected).map((d) => d.dow),
        hours: hourOptions[this.bulkHours].values,
      });
      // reset data & form
      this.dayOptions.forEach((d) => (d.selected = false));
      this.bulkHours = "";
    },
  },
};
</script>
