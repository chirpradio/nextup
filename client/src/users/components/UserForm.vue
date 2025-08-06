<template>
  <form @submit.prevent="onSubmit">
    <div class="form-group row mb-3">
      <label for="email" class="col-sm-3 col-form-label">Email Address *</label>
      <div class="col-sm-6">
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="form.email"
          required
          :disabled="saving"
        />
      </div>
    </div>

    <div class="form-group row mb-3">
      <label for="firstName" class="col-sm-3 col-form-label"
        >First Name *</label
      >
      <div class="col-sm-6">
        <input
          type="text"
          class="form-control"
          id="firstName"
          v-model="form.first_name"
          required
          :disabled="saving"
        />
      </div>
    </div>

    <div class="form-group row mb-3">
      <label for="lastName" class="col-sm-3 col-form-label">Last Name *</label>
      <div class="col-sm-6">
        <input
          type="text"
          class="form-control"
          id="lastName"
          v-model="form.last_name"
          required
          :disabled="saving"
        />
      </div>
    </div>

    <div class="form-group row mb-3">
      <label for="djName" class="col-sm-3 col-form-label">DJ Name</label>
      <div class="col-sm-6">
        <input
          type="text"
          class="form-control"
          id="djName"
          v-model="form.dj_name"
          :disabled="saving"
        />
      </div>
    </div>

    <div class="form-group row mb-3">
      <label class="col-sm-3 col-form-label">Roles</label>
      <div class="col-sm-6 mt-2">
        <div class="row">
          <div class="col-md-6">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="roleDj"
                value="dj"
                v-model="form.roles"
                :disabled="saving"
              />
              <label class="form-check-label" for="roleDj"> DJ </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="roleMusicDirector"
                value="music_director"
                v-model="form.roles"
                :disabled="saving"
              />
              <label class="form-check-label" for="roleMusicDirector">
                Music Director
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="roleReviewer"
                value="reviewer"
                v-model="form.roles"
                :disabled="saving"
              />
              <label class="form-check-label" for="roleReviewer">
                Reviewer
              </label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="roleVolunteerCoordinator"
                value="volunteer_coordinator"
                v-model="form.roles"
                :disabled="saving"
              />
              <label class="form-check-label" for="roleVolunteerCoordinator">
                Volunteer Coordinator
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="roleTrafficLogAdmin"
                value="traffic_log_admin"
                v-model="form.roles"
                :disabled="saving"
              />
              <label class="form-check-label" for="roleTrafficLogAdmin">
                Traffic Log Admin
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-group row mb-3">
      <div class="col-sm-9 offset-sm-3">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="isActive"
            v-model="form.is_active"
            :disabled="saving"
          />
          <label class="form-check-label" for="isActive"> Active User </label>
        </div>
      </div>
    </div>

    <div class="form-group row mt-5">
      <div class="col-sm-9 offset-sm-3">
        <div class="d-flex gap-2">
          <LoadingButton
            type="submit"
            label="add new user"
            :loading="saving"
            loadingText="adding..."
          >
            Create User
          </LoadingButton>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="$emit('cancel')"
            :disabled="saving"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import LoadingButton from "../../components/LoadingButton.vue";

export default {
  name: "UserForm",
  components: {
    LoadingButton,
  },
  emits: ["submit", "cancel"],
  props: {
    saving: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        email: "",
        first_name: "",
        last_name: "",
        dj_name: "",
        roles: [],
        is_active: true,
      },
    };
  },
  methods: {
    onSubmit() {
      this.$emit("submit", { ...this.form });
    },
    resetForm() {
      this.form = {
        email: "",
        first_name: "",
        last_name: "",
        dj_name: "",
        roles: [],
        is_active: true,
      };
    },
  },
};
</script>
