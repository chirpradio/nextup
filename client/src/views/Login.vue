<template>
  <div>
    <h2>Login</h2>
    <p v-if="$route.query.redirect">
      You need to login first.
    </p>
    <form @submit.prevent="login">
      <label><input v-model="email" placeholder="email"></label>
      <label><input v-model="password" placeholder="password" type="password"></label>
      <button type="submit">login</button>
      <p v-if="error" class="error">Bad login information</p>
    </form>
  </div>
</template>

<script>
import authService from "../services/auth.service";
import crateService from "../services/crate.service";

export default {
  data () {
    return {
      email: '',
      password: '',
      error: false
    }
  },
  methods: {
    async login () {
      this.error = false;
      const response = await authService.login(this.email, this.password);
      if(response.token) {        
        this.$store.commit('token', response.token);  
        
        const crates = await crateService.listCrates(response.token);        
        if(crates) {
          this.$store.commit('crates', crates);          
        }

        this.$router.replace(this.$route.query.redirect || '/');
      } else {
        this.error = true;
      }
    }
  }  
}
</script>

<style>
.error {
  color: red;
}
</style>