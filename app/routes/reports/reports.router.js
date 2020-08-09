const router = require("express").Router();

router.use(function setActiveNav(req, res, next) {
  req.app.locals.activeNav = "reports";
  next();
});

router.use("/rotation", require("./rotation/rotation.router"));

module.exports = router;
