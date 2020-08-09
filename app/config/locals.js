const { CrateService } = require("../services");

module.exports = function configureLocals(app) {
  app.use(async (req, res, next) => {
    if (req.user) {
      app.locals.user = req.user;
      app.locals.crates = await CrateService.listCratesForUser(req.user);
    }
    next();
  });
};
