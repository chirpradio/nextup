const logger = require("pino-http")({
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.query.api_key",
  ],
});

module.exports = logger;
