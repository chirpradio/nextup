const logger = require("pino-http")({
  redact: ["req.headers.authorization", "req.headers.cookie"],
});

module.exports = logger;
