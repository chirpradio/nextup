const path = require("path");
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const albumRouter = require("./album.api.router");
const artistRouter = require("./artist.api.router");
const crateRouter = require("./crate.api.router");
const searchRouter = require("./search.api.router");
const tokenRouter = require("./token.api.router");
const { sendErrorCode } = require("./errors");
const authorizeWithToken = passport.authenticate("jwt", { session: false });

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
  authorizeWithToken,
  albumRouter
);

router.use(
  "/artist",
  authorizeWithToken,
  artistRouter
);

router.use(
  "/crate",
  authorizeWithToken,
  crateRouter
);

router.use(
  "/search",
  authorizeWithToken,
  searchRouter
);

router.use("/token", tokenRouter);

// error handling
router.use(sendErrorCode);

module.exports = router;
