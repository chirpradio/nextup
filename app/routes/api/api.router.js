const path = require("path");
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const albumRouter = require("./album/router");
const artistRouter = require("./artist.api.router");
const crateRouter = require("./crate/router");
const playlistRouter = require("./playlist/router");
const searchRouter = require("./search.api.router");
const spotRouter = require("./spot/router");
const trafficLogRouter = require("./traffic-log/router");
const tokenRouter = require("./token.api.router");
const { sendErrorCode } = require("./errors");
const authenticate = passport.authenticate(["api_key", "jwt"], {
  session: false,
});

// documentation at the index
router.get(
  "/",
  /* 
    limit access because it relies on a file read
    which is slow and can be used to attack the site  
  */
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3,
  }),
  function (req, res) {
    res.sendFile(path.join(__dirname, "redoc-static.html"));
  }
);

// routes
router.use("/album", authenticate, albumRouter);
router.use("/artist", authenticate, artistRouter);
router.use("/crate", authenticate, crateRouter);
router.use("/playlist", authenticate, playlistRouter);
router.use("/search", authenticate, searchRouter);
router.use("/spot", authenticate, spotRouter);
router.use("/traffic-log", authenticate, trafficLogRouter);
router.use("/token", tokenRouter);

// error handling
router.use(sendErrorCode);

module.exports = router;
