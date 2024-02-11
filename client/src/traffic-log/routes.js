const routes = [
  {
    path: "/traffic-log/spots",
    name: "spots",
    component: () => import("./views/SpotsView.vue"),
    meta: {
      title: "Spots",
      requiresAuth: "traffic-log",
    },
  },
  {
    path: "/traffic-log/spots/:spotId/copy/add",
    name: "addSpotCopy",
    component: () => import("./views/AddSpotCopyView.vue"),
    props: true,
    meta: {
      title: "Add Spot Copy",
      requiresAuth: "traffic-log",
    },
  },
  {
    path: "/traffic-log/spots/:spotId/copy/:copyId/edit",
    name: "editSpotCopy",
    component: () => import("./views/EditSpotCopyView.vue"),
    props: true,
    meta: {
      title: "Edit Spot Copy",
      requiresAuth: "traffic-log",
    },
  },
  {
    path: "/traffic-log/spots/add",
    name: "addSpot",
    component: () => import("./views/AddEditSpotView.vue"),
    meta: {
      title: "Add Spot",
      requiresAuth: "traffic-log",
    },
  },
  {
    path: "/traffic-log/spots/:spotId/edit",
    name: "editSpot",
    component: () => import("./views/AddEditSpotView.vue"),
    props: true,
    meta: {
      title: "Edit Spot",
      requiresAuth: "traffic-log",
    },
  },
];

export default routes;
