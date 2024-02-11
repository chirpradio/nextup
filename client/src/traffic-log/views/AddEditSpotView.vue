<template>
  <div class="px-3 pb-5">
    <RecordSpinner v-if="loading" />
    <div class="row" v-if="!loading">
      <div class="col-8 pe-5">
        <h1>{{ heading }}</h1>
        <form ref="form" novalidate>
          <div class="row mt-3">
            <label for="name" class="col-2 col-form-label">Title</label>
            <div class="col-6 col-lg-4">
              <input
                id="name"
                class="form-control"
                v-model="title"
                autofocus
                required
              />
              <div class="invalid-feedback">Please enter a title</div>
            </div>
          </div>
          <div class="row mt-3">
            <label for="spot" class="col-2 col-form-label">Type</label>
            <div class="col-6 col-lg-4">
              <select id="spot" class="form-select" v-model="type" required>
                <option v-for="opt in types" :key="opt">{{ opt }}</option>
              </select>
              <div class="invalid-feedback">Please select a type</div>
            </div>
          </div>
          <div class="row mt-3">
            <label for="spot" class="col-2 col-form-label">Break (slot)</label>
            <div class="col-4 col-lg-2">
              <select id="spot" class="form-select" v-model="slot" required>
                <option value="0">00</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="48">48</option>
                <option value="49">49</option>
              </select>
            </div>
          </div>
          <div class="row mt-3">
            <SpotConstraintTable ref="table" :constraints="spot.constraints" />
          </div>
          <div class="d-flex justify-content-end mt-5">
            <button
              class="btn btn-lg btn-outline-chirp-red"
              @click.prevent="onCancel"
              :disabled="saving"
            >
              Cancel
            </button>
            <LoadingButton
              label="Save"
              class="ms-3 btn-lg"
              :loading="saving"
              :small="false"
              @click.prevent="onSave"
            />
          </div>
        </form>
      </div>
      <div class="col-4 border-start ps-3 pt-3">
        <h3>Bulk actions</h3>
        <SpotConstraintBulkActions @bulk-add="onBulkAdd" />
      </div>
    </div>
  </div>
</template>

<script>
import RecordSpinner from "../../components/RecordSpinner.vue";
import SpotConstraintTable from "../components/SpotConstraintTable.vue";
import SpotConstraintBulkActions from "../components/SpotConstraintBulkActions.vue";
import { mapStores } from "pinia";
import { useSpotsStore } from "../store";
import LoadingButton from "../../components/LoadingButton.vue";
import { types } from "../constants";

export default {
  data() {
    return {
      title: "",
      type: "",
      slot: null,
      editing: false,
      types,
    };
  },
  props: {
    spotId: {
      type: String,
      required: false,
    },
  },
  components: {
    SpotConstraintBulkActions,
    SpotConstraintTable,
    RecordSpinner,
    LoadingButton,
  },
  computed: {
    ...mapStores(useSpotsStore),
    loading() {
      return this.spotsStore.loadingSpots;
    },
    heading() {
      return this.editing ? "Edit spot" : "Add spot";
    },
    spot() {
      if (this.spotId) {
        return this.spotsStore.spot(this.spotId);
      }

      return {
        constraints: [],
      };
    },
    saving() {
      return this.spotsStore.savingSpot;
    },
  },
  methods: {
    onBulkAdd({ weekdays, hours }) {
      this.$refs.table.selectCells(weekdays, hours);
    },
    onCancel() {
      this.$router.push({ name: "spots" });
    },
    async onSave() {
      if (this.$refs.form.checkValidity()) {
        if (this.editing) {
          await this.spotsStore.updateSpot(this.spotId, {
            title: this.title,
            type: this.type,
            slot: this.slot,
            selected: this.$refs.table.selected,
          });
        } else {
          await this.spotsStore.addSpot({
            title: this.title,
            type: this.type,
            slot: this.slot,
            selected: this.$refs.table.selected,
          });
        }
        this.$router.push({ name: "spots" });
      } else {
        this.$refs.form.classList.add("was-validated");
        window.scrollTo(0, 0);
      }
    },
  },
  async created() {
    if (this.spotId) {
      this.editing = true;
      await this.spotsStore.getSpot(this.spotId);
      this.title = this.spot.title;
      this.type = this.spot.type;
      if (this.spot.constraints.length) {
        this.slot = this.spot.constraints[0].slot;
      }
    }
  },
};
</script>
