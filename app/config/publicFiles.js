const favicon = require("serve-favicon");
const path = require("path");

module.exports = function configurePublicFiles(app, express) {
  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );
  app.use(express.static("public"));
};
