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
      <div v-for="day in days" :key="day" class="col border p-2">
        {{ day }}
      </div>
    </div>
    <div v-for="row in rows" :key="row.hour">
      <Transition name="bump">
        <div class="row mt-0" v-if="showRow(row)">
          <div v-for="cell in row.cells" :key="cell.day" class="col border p-2">
            <SpotConstraintToggle
              :hour="cell.hour"
              :weekday="cell.day"
              v-model="cell.selected"
            />
          </div>
        </div>
      </Transition>
    </div>
    <div class="row">
      <div v-for="day in days" :key="day" class="col p-2">
        <button
          class="btn btn-sm btn-outline-primary w-100 text-start"
          @click.prevent="clearDay(day)"
        >
          Clear {{ day.slice(0, 3) }}
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
import { days } from "../constants";
import SpotConstraintToggle from "./SpotConstraintToggle.vue";

export default {
  data() {
    const rows = [];
    const hours = _.range(0, 24);
    hours.forEach((hour) => {
      const row = {
        hour,
        cells: [],
      };
      for (const day in days) {
        row.cells.push({
          day,
          hour,
          dow: days[day],
          selected: false,
        });
      }
      rows.push(row);
    });

    return {
      days: Object.keys(days),
      rows,
      showEarlyHours: false,
    };
  },
  props: {
    constraints: {
      type: Array,
      required: false,
    },
  },
  methods: {
    showRow(row) {
      return row.hour >= 6 || this.showEarlyHours;
    },
    clearDay(day) {
      this.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (cell.day === day) {
            cell.selected = false;
          }
        });
      });
    },
    selectCell(dow, hour) {
      const row = this.rows[hour];
      const cell = row.cells.find((cell) => cell.dow === dow);
      cell.selected = true;
    },
    selectCells(dows, hours) {
      this.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (dows.includes(cell.dow) && hours.includes(cell.hour)) {
            cell.selected = true;
          }
        });
      });
    },
  },
  computed: {
    selected() {
      const selected = [];
      this.rows.forEach((row) => {
        row.cells.forEach((cell) => {
          if (cell.selected === true) {
            selected.push(cell);
          }
        });
      });
      return selected;
    },
  },
  created() {
    if (this.constraints && this.constraints.length) {
      this.constraints.forEach((constraint) => {
        this.selectCell(constraint.dow, constraint.hour);
        if (constraint.hour < 6) {
          this.showEarlyHours = true;
        }
      });
    }
  },
  components: { SpotConstraintToggle },
};
</script>
