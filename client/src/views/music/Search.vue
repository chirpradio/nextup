<template>
  <div>
    <div class="row">
      <div class="col-md-12 pb-4 mb-2 border-bottom">
        <router-view name="filters" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <router-view name="results" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  title: "Search",
};
</script>
