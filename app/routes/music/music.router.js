const router = require("express").Router();
const MusicController = require("./music.controller");

router.use(function setActiveNav(req, res, next) {
  req.app.locals.activeNav = "music";
  next();
});

router.get("/", MusicController.indexHandler);

router.use("/album", require("./album/album.router"));
router.use("/artist", require("./artist/artist.router"));
router.use("/crate", require("./crate/crate.router"));
router.use("/recent", require("./recent/recent.router"));
router.use("/search", require("./search/search.router"));
router.use("/tag", require("./tag/tag.router"));

module.exports = router;
