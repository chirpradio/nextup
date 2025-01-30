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
];

export default routes;
