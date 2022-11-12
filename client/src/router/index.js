import { createRouter, createWebHistory } from "vue-router";
import qs from "qs";
import formatters from "../mixins/formatters";

import Login from "../views/Login.vue";
import Album from "../views/music/Album.vue";
import MusicHome from "../views/music/MusicHome.vue";
import Music from "../views/music/Music.vue";
import Tag from "../views/music/Tag.vue";
import LibraryAdds from "../views/music/LibraryAdds.vue";
import Artist from "../views/music/Artist.vue";
import Search from "../views/music/Search.vue";
import Crates from "../views/crates/Crates.vue";
import Crate from "../views/crates/Crate.vue";
import Playlist from "../views/playlist/Playlist.vue";
import RotationAlbums from "../views/reports/RotationAlbums";
import RotationPlays from "../views/reports/RotationPlays";
import EverythingFilters from "../components/music/search/EverythingFilters.vue";
import EverythingResults from "../components/music/search/EverythingResults.vue";
import AlbumFilters from "../components/music/search/album/AlbumFilters.vue";
import AlbumResults from "../components/music/search/album/AlbumResults.vue";
import TrackFilters from "../components/music/search/track/TrackFilters.vue";
import TrackResults from "../components/music/search/track/TrackResults.vue";
import ArtistResults from "../components/music/search/artist/ArtistResults.vue";
import DocumentResults from "../components/music/search/document/DocumentResults.vue";
import TermFilter from "../components/music/search/TermFilter.vue";

import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/login",
    name: "Log In",
    component: Login,
  },
  {
    path: "/",
    redirect: "/library",
  },
  {
    path: "/library",
    alias: "/music",
    component: Music,
    meta: {
      breadcrumb: "Library",
    },
    children: [
      {
        path: "",
        name: "MusicHome",
        component: MusicHome,
        meta: {
          breadcrumb: "Home",
          hideBreadcrumb: true,
        },
      },
      {
        path: "tag/:tag",
        name: "tag",
        component: Tag,
        props: true,
        meta: {
          breadcrumb: (route) => formatters.methods.formatTag(route.params.tag),
        },
      },
      {
        path: "library_adds",
        name: "LibraryAdds",
        component: LibraryAdds,
        meta: {
          breadcrumb: "Library Adds",
        },
      },
      {
        path: "album/:id",
        name: "album",
        component: Album,
        props: true,
        meta: { hideBreadcrumb: true },
      },
      {
        path: "artist/:id",
        name: "artist",
        component: Artist,
        props: true,
        meta: { hideBreadcrumb: true },
      },
      {
        path: "search",
        name: "Search",
        component: Search,
        meta: {
          breadcrumb: "Search",
        },
        children: [
          {
            path: "",
            name: "SearchEverything",
            components: {
              filters: EverythingFilters,
              results: EverythingResults,
            },
          },
          {
            path: "album",
            components: {
              filters: AlbumFilters,
              results: AlbumResults,
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
              filters: TrackFilters,
              results: TrackResults,
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
              filters: TermFilter,
              results: ArtistResults,
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
              filters: TermFilter,
              results: DocumentResults,
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
    component: RotationAlbums,
  },
  {
    path: "/reports/rotation/plays",
    component: RotationPlays,
  },
  {
    path: "/crates",
    component: Crates,
  },
  { path: "/crates/:id", name: "crate", component: Crate, props: true },
  { path: "/playlist", name: "playlist", component: Playlist },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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

export default router;
