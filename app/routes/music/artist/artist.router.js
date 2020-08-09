const router = require("express").Router();
const ArtistController = require("./artist.controller");

router.get("/:artist_id", ArtistController.artistHandler);

module.exports = router;
