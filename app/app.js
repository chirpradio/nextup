require("@google-cloud/debug-agent").start();
require("./db");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

require("./config/auth")(app);
require("./config/flashMessages")(app);
require("./config/locals")(app);
require("./config/publicFiles")(app, express);
require("./config/views")(app);
require("./routes")(app);

module.exports = app;
