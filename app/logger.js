const logger = require("pino-http")({
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
