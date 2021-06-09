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
            </div>
          </li>
        </ul>
        <form
          id="navbarSearch"
          class="form-inline my-2 my-lg-0"
          v-on:submit.prevent="search"
        >
          <input
            class="form-control mr-sm-2"
            type="search"
            v-model="term"
            placeholder="Search"
            aria-label="Search"
          />
        </form>
        <div class="dropdown">
          <button
            class="btn btn-outline-link navbar-text dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {{ userName }}
          </button>
          <div
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuButton"
          >
            <button class="dropdown-item" @click="logOut">log out</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      term: "",
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userName() {
      const user = this.$store.state.auth.user;
      return `${user.first_name} ${user.last_name}`;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("logOut");
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
