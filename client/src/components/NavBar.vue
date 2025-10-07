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
          <li class="nav-item dropdown">
            <button
              class="btn btn-link nav-link dropdown-toggle"
              id="admin-menu-link"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Admin
            </button>
            <div class="dropdown-menu" aria-labelledby="admin-menu-link">
              <li>
                <h6 class="dropdown-header">Reports</h6>
              </li>
              <router-link class="dropdown-item" to="/reports/rotation/albums">
                Rotation Albums
              </router-link>
              <router-link class="dropdown-item" to="/reports/rotation/plays">
                Rotation Plays
              </router-link>
              <li v-if="isAuthorized('traffic-log')">
                <hr class="dropdown-divider" />
              </li>
              <li v-if="isAuthorized('traffic-log')">
                <h6 class="dropdown-header">Traffic Log</h6>
              </li>
              <router-link
                v-if="isAuthorized('traffic-log')"
                class="dropdown-item"
                to="/traffic-log/spots"
              >
                Spots
              </router-link>
              <li v-if="isAuthorized('users')">
                <hr class="dropdown-divider" />
              </li>
              <li v-if="isAuthorized('users')">
                <h6 class="dropdown-header">User Management</h6>
              </li>
              <router-link
                v-if="isAuthorized('users')"
                class="dropdown-item"
                to="/users"
              >
                Users
              </router-link>
            </div>
          </li>
        </ul>
        <form
          id="navbarSearch"
          class="form-inline my-2 my-lg-0 me-4"
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
        <div class="dropdown navbar-nav">
          <button
            class="btn nav-link dropdown-toggle"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ initials }}
          </button>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="userDropdown"
          >
            <p class="ms-3 text-muted">
              {{ displayName }}
            </p>
            <li>
              <router-link class="dropdown-item" to="/profile">
                edit your profile
              </router-link>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button class="dropdown-item" @click="logOut">
                <font-awesome-icon icon="right-from-bracket" class="me-2" />
                log out
              </button>
            </li>
          </ul>
        </div>
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

.username {
  font-size: 0.875rem;
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
    initials() {
      const user = this.authStore.user;
      return `${user.first_name?.slice(0, 1)}${user.last_name?.slice(0, 1)}`;
    },
    displayName() {
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
