const routes = [
  {
    path: "/playlist",
    name: "playlist",
    component: () => import("./views/PlaylistView.vue"),
    meta: {
      title: "Playlist",
      requiresAuth: "playlist",
    },
  },
  {
    path: "/playlist/report",
    name: "playlist-report",
    component: () => import("./views/PlaylistReport.vue"),
    meta: {
      title: "Playlist Report",
      requiresAuth: "playlist-report",
    },
  },
];

export default routes;
