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
  },
  production: {
    playlist: {
      users: [
        "tony@chirpradio.org",
        "jennamlchapman@gmail.com",
        "alexarchibeque0024@gmail.com",
        "buesary@gmail.com",
        "chris.r.siuty@gmail.com",
        "cornelia.q.smith@gmail.com",
        "craigb@chirpradio.org",
        "griffimichael@gmail.com",
        "jenn@chirpradio.org",
        "kevinshields101@hotmail.com",
        "mike@nikolich.com",
        "namowhammo@yahoo.com",
        "scott@chirpradio.org",
        "studio@joslinlakedesign.com",
        "mattbarr1516@yahoo.com",
        "pigface13@yahoo.com",
        "fatimashahkhan@gmail.com",
      ],
    },
    "traffic-log": {
      roles: ["traffic_log_admin"],
    },
  },
};
