const path = require("path");
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const albumRouter = require("./album.api.router");
const crateRouter = require("./crate.api.router");
const tokenRouter = require("./token.api.router");

// documentation at the index
router.get(
  "/",
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3,
  }),
  function (req, res) {
    res.sendFile(path.join(__dirname, "redoc-static.html"));
  }
);

// routes
router.use(
  "/album",
  passport.authenticate("jwt", { session: false }),
  albumRouter
);
router.use(
  "/crate",
  passport.authenticate("jwt", { session: false }),
  crateRouter
);
router.use("/token", tokenRouter);

// error handling
router.use((error, req, res, next) => {
  console.error(error);
  let code = 500;

  if (error.code === "ERR_ENTITY_NOT_FOUND") {
    code = 404;
  }

  res.sendStatus(code);
});

module.exports = router;
