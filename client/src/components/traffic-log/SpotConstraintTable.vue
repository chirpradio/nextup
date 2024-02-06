<template>
  <div class="d-inline-flex align-items-end">
    <label for="spot" class="col-2 col-form-label flex-grow-1">Schedule</label>
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="earlyHoursCheck"
        v-model="showEarlyHours"
      />
      <label class="form-check-label" for="earlyHoursCheck"
        >show early hours</label
      >
    </div>
  </div>
  <div class="ms-1 mt-1">
    <div class="row font-sans">
      <div v-for="weekday in weekdays" :key="weekday" class="col border p-2">
        {{ weekday }}
      </div>
    </div>
    <div v-for="row in hoursRows" :key="row.hour">
      <Transition name="bump">
        <div class="row mt-0" v-if="showRow(row)">
          <div
            v-for="cell in row.cells"
            :key="cell.weekday"
            class="col border p-2"
          >
            <SpotConstraintToggle
              :hour="cell.hour"
              :weekday="cell.weekday"
              v-model="cell.selected"
            />
          </div>
        </div>
      </Transition>
    </div>
    <div class="row">
      <div v-for="weekday in weekdays" :key="weekday" class="col p-2">
        <button
          class="btn btn-sm btn-outline-primary w-100 text-start"
          @click.prevent="clearDay(weekday)"
        >
          Clear {{ weekday.slice(0, 3) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bump-enter-active,
.bump-leave-active {
  transition: all 0.3s ease-out;
}

.bump-enter-from,
.bump-leave-to {
  transform: translateY(1rem);
  opacity: 0;
}
</style>

<script>
import _ from "lodash";
import { days } from "../../constants";
import SpotConstraintToggle from "./SpotConstraintToggle.vue";

export default {
  data() {
    const hoursRows = [];
    const hours = _.range(0, 24);
    hours.forEach((hour) => {
      const row = {
        hour,
        cells: [],
      };
      days.forEach((weekday) => {
        row.cells.push({
          hour,
          weekday,
          selected: false,
        });
      });
      hoursRows.push(row);
    });
    return {
      weekdays: days,
      hoursRows,
      showEarlyHours: false,
    };
  },
  methods: {
    showRow(row) {
      if (!this.showEarlyHours && row.hour < 6) {
        return false;
      }
      return true;
    },
    clearDay(weekday) {
      this.hoursRows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (cell.weekday === weekday) {
            cell.selected = false;
          }
        });
      });
    },
    selectHours(days, hours) {
      this.hoursRows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (days.includes(cell.weekday) && hours.includes(cell.hour)) {
            cell.selected = true;
          }
        });
      });
    },
  },
  computed: {
    selected() {
      const selected = [];
      this.hoursRows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (cell.selected === true) {
            selected.push(cell);
          }
        });
      });
      return selected;
    },
  },
  components: { SpotConstraintToggle },
};
</script>
