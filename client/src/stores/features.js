/**
 * Feature flags by environment and by user and/or role.
 *
 * environment: {
 *  feature: {
 *    users: [],
 *    roles: [],
 *  }
 * }
 **/

export default {
  development: {
    playlist: {
      roles: ["dj"],
    },
    "traffic-log": {
      roles: ["traffic_log_admin"],
    },
    users: {
      superuser: true,
      roles: ["volunteer_coordinator"],
    },
  },
  production: {
    playlist: {
      roles: ["dj"],
    },
    "traffic-log": {
      roles: ["traffic_log_admin"],
    },
    users: {
      superuser: true,
      roles: ["volunteer_coordinator"],
    },
  },
};
