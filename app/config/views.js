const exphbs = require("express-handlebars");
const helpers = require("../views/handlebars.helpers");

module.exports = function configureViews(app) {
  // put pages next to their controllers in routes/
  app.set("views", "routes/");
  // but keep shared resources in views/
  app.engine(
    "handlebars",
    exphbs({
      helpers,
      layoutsDir: "views/layouts/",
      partialsDir: "views/partials/",
    })
  );
  app.set("view engine", "handlebars");
};
