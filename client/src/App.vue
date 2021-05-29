<template>
  <div>
    <NavBar />
    <router-view class="container-fluid py-3" />
  </div>
</template>

<style>
:root {
  --dark-red: #822036;
  --bright-red: #ee0032;
}

body {
  font-family: Georgia, 'Times New Roman', Times, serif;
}

h1, h2, h3, h4, h5, h6, button, label, .btn, .navbar, .badge, .breadcrumb, .pagination {
  font-family: Futura, "Trebuchet MS", "Helvetica Neue", Helvetica, Arial, sans-serif;  
}

a { 
  color: var(--dark-red);
}

a:hover {
  color: var(--bright-red);
}

button.btn-chirp-red {
  background-color: var(--dark-red);
  border-color: var(--dark-red);
  color: #fff;
}

button.btn-chirp-red:hover {
 background-color: var(--bright-red);
 color: #fff; 
}

button.btn-link-chirp-red, a.btn-link-chirp-red {
  color: var(--dark-red);
}

button.btn-link-chirp-red:hover, a.btn-link-chirp-red:hover {
  color: var(--bright-red);
}

.no_overflow {
  text-overflow: clip;
}

.search_result__col {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

<script>
import NavBar from "./components/NavBar";

export default {
  components: {
    NavBar,
  }
}
</script>