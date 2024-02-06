<template>
  <form ref="form" novalidate>
    <fieldset class="mt-3">
      <div v-for="weekday in weekdays" :key="weekday.day" class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="weekday.selected"
          :id="weekday.id"
        />
        <label class="form-check-label" :for="weekday.id">
          {{ weekday.day }}
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
      class="btn btn-primary mt-5"
      :disabled="disableAddButton"
      @click.prevent="onAdd"
    >
      Add
    </button>
  </form>
</template>

<script>
import _ from "lodash";
import { days } from "../../constants";

const BULK_ADD = "bulkAdd";
const hourOptions = {
  everyHour: {
    label: "Every hour",
    values: _.range(0, 24),
  },
  evenHours: {
    label: "Even hours",
    values: _.range(0, 24).filter((h) => h % 2 === 0),
  },
  oddHours: {
    label: "Odd hours",
    values: _.range(0, 24).filter((h) => h % 2 === 1),
  },
  everyThreeHours: {
    label: "Every three hours",
    values: _.range(0, 24).filter((h) => h % 3 === 0),
  },
  everySixHours: {
    label: "Every six hours",
    values: _.range(0, 24).filter((h) => h % 6 === 0),
  },
};

export default {
  data() {
    const weekdays = days.map((day) => {
      return { day, id: `${day}Check`, selected: false };
    });
    return {
      weekdays,
      hourOptions,
      bulkHours: "",
    };
  },
  computed: {
    disableAddButton() {
      return !this.bulkHours || !this.weekdays.some((d) => d.selected);
    },
  },
  emits: [BULK_ADD],
  methods: {
    onAdd() {
      this.$emit(BULK_ADD, {
        weekdays: this.weekdays.filter((d) => d.selected).map((d) => d.day),
        hours: hourOptions[this.bulkHours].values,
      });
      // reset data & form
      this.weekdays.forEach((d) => (d.selected = false));
      this.bulkHours = "";
    },
  },
};
</script>
