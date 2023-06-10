const logger = require("pino-http")({
  redact: ["req.headers.authorization"],
});

module.exports = logger;
