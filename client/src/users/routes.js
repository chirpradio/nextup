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
  {
    path: "/users/:id/edit",
    name: "editUser",
    component: () => import("./views/EditUserView.vue"),
    props: true,
    meta: {
      title: "Edit User",
      requiresAuth: "users",
    },
  },
];

export default routes;
