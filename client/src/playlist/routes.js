const routes = [
  {
    path: "/playlist",
    name: "playlist",
    component: () => import("./views/PlaylistView.vue"),
  },
];

export default routes;
