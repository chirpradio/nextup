const logger = require("pino-http")({
  // Disable logging during tests
  enabled: process.env.NODE_ENV !== 'test',
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.query.api_key",
  ],
  customProps: function (req) {
    return {
      email: req.user?.email,
    };
  },
});

module.exports = logger;
