<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="route in ancestors"
        :key="route.breadcrumb"
        class="breadcrumb-item"
      >
        <router-link :to="route.path">{{ route.breadcrumb }}</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        {{ current.breadcrumb }}
      </li>
    </ol>
  </nav>
</template>

<script>
function getBreadcrumb(match, route) {
  const breadcrumb = match.meta.breadcrumb;
  return typeof breadcrumb === "function"
    ? breadcrumb.call(route, route)
    : breadcrumb;
}

export default {
  name: "BreadCrumbs",
  props: {
    heading: {
      type: String,
      default: "",
    },
  },
  computed: {
    ancestors() {
      return this.$route.matched.slice(0, -1).map((match) => {
        return {
          path: match.path,
          breadcrumb: getBreadcrumb(match, this.$route),
        };
      });
    },
    current() {
      const match = this.$route.matched[this.$route.matched.length - 1];
      return {
        breadcrumb: getBreadcrumb(match, this.$route),
      };
    },
  },
};
</script>
