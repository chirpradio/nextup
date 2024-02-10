import { createRouter, createWebHistory } from "vue-router";
import qs from "qs";
import formatters from "../mixins/formatters";
import { useAuthStore } from "../stores/auth";
import trafficLogRoutes from "../traffic-log/routes";

const routes = [
  {
    path: "/login",
    name: "Log In",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/",
    redirect: "/library",
  },
  {
    path: "/library",
    alias: "/music",
    component: () => import("../views/music/MusicView.vue"),
    meta: {
      breadcrumb: "Library",
    },
    children: [
      {
        path: "",
        name: "MusicHome",
        component: () => import("../views/music/MusicHome.vue"),
        meta: {
          breadcrumb: "Home",
          hideBreadcrumb: true,
        },
      },
      {
        path: "tag/:tag",
        name: "tag",
        component: () => import("../views/music/TagView.vue"),
        props: true,
        meta: {
          breadcrumb: (route) => formatters.methods.formatTag(route.params.tag),
        },
      },
      {
        path: "library_adds",
        name: "LibraryAdds",
        component: () => import("../views/music/LibraryAdds.vue"),
        meta: {
          breadcrumb: "Library Adds",
        },
      },
      {
        path: "album/:id",
        name: "album",
        component: () => import("../views/music/AlbumView.vue"),
        props: true,
        meta: { hideBreadcrumb: true },
      },
      {
        path: "artist/:id",
        name: "artist",
        component: () => import("../views/music/ArtistView.vue"),
        props: true,
        meta: { hideBreadcrumb: true },
      },
      {
        path: "search",
        name: "Search",
        component: () => import("../views/music/SearchView.vue"),
        meta: {
          breadcrumb: "Search",
        },
        children: [
          {
            path: "",
            name: "SearchEverything",
            components: {
              filters: () =>
                import("../components/music/search/EverythingFilters.vue"),
              results: () =>
                import("../components/music/search/EverythingResults.vue"),
            },
          },
          {
            path: "album",
            components: {
              filters: () =>
                import("../components/music/search/album/AlbumFilters.vue"),
              results: () =>
                import("../components/music/search/album/AlbumResults.vue"),
            },
            props: {
              results: {
                showAllLink: false,
                showHeader: false,
                showPagination: true,
              },
            },
            meta: {
              breadcrumb: "Album",
            },
          },
          {
            path: "track",
            components: {
              filters: () =>
                import("../components/music/search/track/TrackFilters.vue"),
              results: () =>
                import("../components/music/search/track/TrackResults.vue"),
            },
            props: {
              results: {
                showAllLink: false,
                showHeader: false,
                showPagination: true,
              },
            },
            meta: {
              breadcrumb: "Track",
            },
          },
          {
            path: "artist",
            components: {
              filters: () =>
                import("../components/music/search/TermFilter.vue"),
              results: () =>
                import("../components/music/search/artist/ArtistResults.vue"),
            },
            meta: {
              breadcrumb: "Artist",
            },
            props: {
              filters: {
                type: "artist",
              },
              results: {
                showAllLink: false,
                showHeader: false,
                showPagination: true,
              },
            },
          },
          {
            path: "review",
            components: {
              filters: () =>
                import("../components/music/search/TermFilter.vue"),
              results: () =>
                import(
                  "../components/music/search/document/DocumentResults.vue"
                ),
            },
            meta: {
              breadcrumb: "Review",
            },
            props: {
              filters: {
                type: "document",
              },
              results: {
                showAllLink: false,
                showHeader: false,
                showPagination: true,
              },
            },
          },
        ],
      },
    ],
  },
  {
    path: "/reports/rotation/albums",
    component: () => import("../views/reports/RotationAlbums.vue"),
  },
  {
    path: "/reports/rotation/plays",
    component: () => import("../views/reports/RotationPlays.vue"),
  },
  {
    path: "/crates",
    component: () => import("../views/crates/CratesView.vue"),
  },
  {
    path: "/crates/:id",
    name: "crate",
    component: () => import("../views/crates/CrateView.vue"),
    props: true,
  },
  {
    path: "/playlist",
    name: "playlist",
    component: () => import("../views/playlist/PlaylistView.vue"),
  },
  ...trafficLogRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  parseQuery(query) {
    return qs.parse(query);
  },
  stringifyQuery(query) {
    const result = qs.stringify(query);
    return result || "";
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name !== "Log In" && !authStore.isAuthenticated) {
    next({ name: "Log In", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} – NextUp`;
  }
});

export default router;
