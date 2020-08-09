const flash = require("connect-flash");

module.exports = function configureFlashMessages(app) {
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.successMessages = req.flash("successMessages");
    res.locals.errorMessages = req.flash("errorMessages");
    next();
  });
};
