require("@google-cloud/debug-agent").start();
require("./db");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

const cors = require("cors");
app.use(cors());

const pino = require('pino-http')();
app.use(pino);

require("./config/auth")(app);
require("./routes")(app);

module.exports = app;
