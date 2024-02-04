<template>
  <form ref="form" novalidate>
    <div class="row mt-3">
      <label for="name" class="col-2 col-form-label">Name *</label>
      <div class="col-3">
        <input
          id="name"
          class="form-control"
          v-model="name"
          autofocus
          required
        />
      </div>
    </div>
    <div class="row mt-3">
      <label for="body" class="col-2 col-form-label">Body *</label>
      <div class="col-6">
        <textarea id="body" class="form-control" v-model="body" required />
      </div>
    </div>
    <div class="row mt-3">
      <label for="start" class="col-2 col-form-label">Start *</label>
      <div class="col-3">
        <input
          type="datetime-local"
          id="start"
          class="form-control"
          v-model="start_on"
          required
        />
      </div>
    </div>
    <div class="row mt-3">
      <label for="expire" class="col-2 col-form-label">Expire</label>
      <div class="col-3">
        <input
          type="datetime-local"
          id="expire"
          class="form-control"
          v-model="expire_on"
        />
      </div>
    </div>
    <div class="row mt-3">
      <label for="underwriter" class="col-2 col-form-label">Underwriter</label>
      <div class="col-3">
        <input id="underwriter" class="form-control" v-model="underwriter" />
      </div>
    </div>
    <div class="row mt-3">
      <label for="spot" class="col-2 col-form-label">Spot *</label>
      <div class="col-3">
        <select id="spot" class="form-select" v-model="spot_id" required>
          <option v-for="spot in spots" :key="spot.id" :value="spot.id">
            {{ spot.title }}
          </option>
        </select>
      </div>
    </div>
    <div class="row mt-3">
      <div class="offset-6">
        <router-link
          :to="{ name: 'spots' }"
          class="btn btn-link-chirp-red me-2"
        >
          Cancel
        </router-link>
        <LoadingButton
          label="Save"
          :loading="saving"
          :small="false"
          @click="onSave"
        />
      </div>
    </div>
  </form>
</template>

<style scoped>
#body {
  height: 10rem;
}
</style>

<script>
import { mapStores } from "pinia";
import { useSpotsStore } from "@/stores/spots";
import LoadingButton from "../LoadingButton.vue";

const SAVE = "save";

function getFullDateTimeString(str) {
  if (str) {
    const dateTimeMask = "0000-00-00T00:00:00.000Z";
    return str + dateTimeMask.substring(str.length);
  }

  return null;
}

export default {
  data() {
    return {
      name: "",
      body: "",
      start_on: "",
      expire_on: "",
      underwriter: "",
      spot_id: "",
      saving: false,
    };
  },
  props: {
    copy: Object,
  },
  computed: {
    ...mapStores(useSpotsStore),
    spots() {
      return this.spotsStore.spots;
    },
  },
  mounted() {
    this.name = this.copy.name;
    this.body = this.copy.body;
    this.start_on = this.copy.start_on?.slice(0, 19);
    this.expire_on = this.copy.expire_on?.slice(0, 19);
    this.underwriter = this.copy.underwriter;
    this.spot_id = this.copy.spot.id;
  },
  emits: [SAVE],
  methods: {
    onSave(event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.$refs.form.checkValidity()) {
        this.saving = true;

        this.$emit(SAVE, {
          name: this.name,
          body: this.body,
          underwriter: this.underwriter,
          spot: parseInt(this.spot_id, 10),
          start_on: getFullDateTimeString(this.start_on),
          expire_on: getFullDateTimeString(this.expire_on),
        });
      } else {
        this.$refs.form.classList.add("was-validated");
      }
    },
  },
  components: { LoadingButton },
};
</script>
