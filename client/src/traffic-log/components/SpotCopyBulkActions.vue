<template>
  <form ref="form" novalidate>
    <div class="row mt-4">
      <label for="expire" class="form-label p-0">Set start date & time</label>
      <input
        type="datetime-local"
        id="expire"
        class="form-control"
        v-model="start_on"
      />
    </div>
    <div class="row mt-4">
      <label for="expire" class="form-label p-0"
        >Set expiration date & time</label
      >
      <input
        type="datetime-local"
        id="expire"
        class="form-control"
        v-model="expire_on"
      />
    </div>
    <div class="row mt-4">
      <div class="form-check">
        <input type="checkbox" id="delete" v-model="deleteCopy" class="form-check-input" />
        <label for="delete" class="form-check-label">Delete selected copy</label>
      </div>
    </div>
    <div class="row mt-4">    
      <LoadingButton :loading="updatingCopy" @click.prevent="onSet" :label="label" :small="false" :disable="disabled" />
    </div>
  </form>
</template>

<script>
import LoadingButton from "../../components/LoadingButton.vue";
import { getFullDateTimeString } from "../functions";

const BULK_UPDATE = "bulkUpdate";

export default {
    data() {
        return {
            expire_on: "",
            start_on: "",
            deleteCopy: false,
        };
    },
    props: {
        count: {
            type: Number,
            default: 0,
        },
        updatingCopy: Boolean,
    },
    computed: {
        label() {
            let verb = ""
            if(this.deleteCopy) {
              verb = this.updatingCopy ? "Deleting" : "Delete";
            } else {
              verb = this.updatingCopy ? "Updating" : "Update";
            }                    
            const noun = this.count === 1 ? "copy" : "copies";
            return `${verb} ${this.count} ${noun}`;
        },
        disabled() {
            return this.count === 0;
        },
    },
    emits: [BULK_UPDATE],
    methods: {
        onSet() {
            this.$emit(BULK_UPDATE, {
                expire_on: getFullDateTimeString(this.expire_on),
                start_on: getFullDateTimeString(this.start_on),
                deleteCopy: this.deleteCopy,
            });
        },
        reset() {
          this.expire_on = "";
          this.start_on = "";
          this.deleteCopy = false;
        }
    },
    components: { LoadingButton }
};
</script>
