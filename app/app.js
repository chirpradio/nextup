require("@google-cloud/debug-agent").start();
require("./db");

const express = require("express");
const app = express();

app.use(require("body-parser").urlencoded({ extended: true }));
require("./config/auth")(app);
require("./config/flashMessages")(app);
require("./config/locals")(app);
require("./config/publicFiles")(app, express);
require("./config/views")(app);
require("./routes")(app);

module.exports = app;
