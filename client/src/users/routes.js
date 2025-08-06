const routes = [
  {
    path: "/users",
    name: "users",
    component: () => import("./views/UsersView.vue"),
    meta: {
      title: "Users",
      requiresAuth: "users",
    },
  },
  {
    path: "/users/add",
    name: "addUser",
    component: () => import("./views/AddUserView.vue"),
    meta: {
      title: "Add User",
      requiresAuth: "users",
    },
  },
];

export default routes;
