<template>
  <div class="px-3">
    <h1>Add a new spot</h1>
    <div class="row">
      <div class="col-8 pe-5">
        <form ref="form" novalidate>
          <div class="row mt-3">
            <label for="name" class="col-2 col-form-label">Title</label>
            <div class="col-4">
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
            <div class="col-4">
              <select id="spot" class="form-select" v-model="type" required>
                <option value="Live Read Promo">Live Read Promo</option>
                <option value="Recorded Promo">Recorded Promo</option>
                <option value="Live Read PSA">Live Read PSA</option>
                <option value="Recorded PSA">Recorded PSA</option>
                <option value="Underwriting Spot">Underwriting Spot</option>
                <option value="Pledge Liner">Pledge Liner</option>
                <option value="Station ID">Station ID</option>
                <option value="Other">Other</option>
              </select>
              <div class="invalid-feedback">Please select a type</div>
            </div>
          </div>
          <div class="row mt-3">
            <label for="spot" class="col-2 col-form-label">Break (slot)</label>
            <div class="col-2">
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
            <SpotConstraintTable ref="table" />
          </div>
          <div class="d-flex justify-content-end mt-3">
            <button class="btn btn-lg btn-chirp-red" @click.prevent="onSave">
              Save
            </button>
          </div>
        </form>
      </div>
      <div class="col-4 border-start ps-4">
        <h3>Bulk actions</h3>
        <SpotConstraintBulkActions @bulk-add="onBulkAdd" />
      </div>
    </div>
  </div>
</template>

<script>
import SpotConstraintBulkActions from "../../components/traffic-log/SpotConstraintBulkActions.vue";
import SpotConstraintTable from "../../components/traffic-log/SpotConstraintTable.vue";
import { mapStores } from "pinia";
import { useSpotsStore } from "@/stores/spots";

export default {
  data() {
    return {
      title: "",
      type: "",
      slot: 0,
    };
  },
  computed: {
    ...mapStores(useSpotsStore),
  },
  methods: {
    onBulkAdd(event) {
      this.$refs.table.selectHours(event.weekdays, event.hours);
    },
    async onSave() {
      if (this.$refs.form.checkValidity()) {
        await this.spotsStore.addSpot({
          title: this.title,
          type: this.type,
          slot: this.slot,
          selected: this.$refs.table.selected,
        });
        this.$router.push({ name: "spots" });
      } else {
        this.$refs.form.classList.add("was-validated");
      }
    },
  },
  components: { SpotConstraintTable, SpotConstraintBulkActions },
};
</script>
