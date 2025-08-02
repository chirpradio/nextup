<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-8">
        <h1>Add New User</h1>
        
        <div v-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <UserForm 
          :saving="savingUser"
          @submit="onCreateUser"
          @cancel="onCancel"
          ref="userForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useUsersStore } from "../store";
import UserForm from "../components/UserForm.vue";

export default {
  name: "AddUserView",
  components: {
    UserForm,
  },
  computed: {
    ...mapState(useUsersStore, ["savingUser", "createdUser", "temporaryPassword", "error"]),
  },
  methods: {
    ...mapActions(useUsersStore, ["createUser", "setSuccessMessage", "clearError"]),
    
    async onCreateUser(userData) {
      try {        
        await this.createUser(userData);        
        this.setSuccessMessage(true);
        this.$router.push("/users");
      } catch (error) {
        console.error("Failed to create user:", error);
      }
    },
    
    onCancel() {
      this.$router.push("/users");
    },
  },
  
  beforeUnmount() {
    this.clearError();
  },
};
</script>