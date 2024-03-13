<template>
  <nav
    v-if="isAuthenticated"
    class="navbar navbar-dark navbar-expand-sm bg-dark"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">NextUp</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbar-content"
        aria-controls="navbar-content"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbar-content">
        <ul class="navbar-nav me-auto">
          <li class="nav-item dropdown">
            <button
              class="btn btn-link nav-link dropdown-toggle"
              to="/library"
              id="music-menu-link"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Library
            </button>
            <div class="dropdown-menu" aria-labelledby="music-menu-link">
              <router-link class="dropdown-item" to="/library">
                Home
              </router-link>
              <router-link class="dropdown-item" to="/library/search">
                Search
              </router-link>
              <router-link
                class="dropdown-item"
                to="/library/tag/heavy_rotation"
              >
                Heavy Rotation
              </router-link>
              <router-link
                class="dropdown-item"
                to="/library/tag/light_rotation"
              >
                Light Rotation
              </router-link>
              <router-link class="dropdown-item" to="/library/library_adds">
                Library Adds
              </router-link>
            </div>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" active-class="active" to="/crates"
              >Crates</router-link
            >
          </li>
          <li class="nav-item" v-if="isAuthorized('playlist')">
            <router-link class="nav-link" active-class="active" to="/playlist"
              >Playlist</router-link
            >
          </li>
          <li class="nav-item dropdown" v-if="isAuthorized('traffic-log')">
            <button
              class="btn btn-link nav-link dropdown-toggle"
              id="traffic-log-menu-link"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Traffic Log
            </button>
            <div class="dropdown-menu" aria-labelledby="traffic-log-menu-link">
              <router-link class="dropdown-item" to="/traffic-log/spots">
                Spots
              </router-link>
            </div>
          </li>
          <li class="nav-item dropdown">
            <button
              class="btn btn-link nav-link dropdown-toggle"
              id="report-menu-link"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Reports
            </button>
            <div class="dropdown-menu" aria-labelledby="report-menu-link">
              <router-link class="dropdown-item" to="/reports/rotation/albums">
                Rotation Albums
              </router-link>
              <router-link class="dropdown-item" to="/reports/rotation/plays">
                Rotation Plays
              </router-link>
            </div>
          </li>
        </ul>
        <form
          id="navbarSearch"
          class="form-inline my-2 my-lg-0 me-2"
          v-on:submit.prevent="search"
        >
          <input
            class="form-control mr-sm-2"
            type="search"
            v-model="term"
            placeholder="Search the library"
            aria-label="Search"
          />
        </form>
        <button class="btn btn-outline-light" @click="logOut">log out</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 
  Position above Bootstrap's sticky elements
  See: https://getbootstrap.com/docs/5.0/layout/z-index/ 
*/
.dropdown-menu {
  z-index: 1035;
}
</style>

<script>
import { mapStores } from "pinia";
import { useAuthStore } from "../stores/auth";

export default {
  name: "NavBar",
  data() {
    return {
      term: "",
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    userName() {
      const user = this.authStore.user;
      return `${user.first_name} ${user.last_name}`;
    },
  },
  methods: {
    isAuthorized(feature) {
      return this.authStore.isAuthorized(feature);
    },
    logOut() {
      this.authStore.logOut();
      this.$router.push("/login");
    },
    search() {
      this.$gtag.event("Search", {
        event_category: "Library",
        event_label: "Navbar",
      });
      this.$router.push({
        name: "SearchEverything",
        query: { term: this.term },
      });
      this.term = "";
    },
  },
};
</script>
