const router = require("express").Router();
const AlbumController = require("./album.controller");

router.get("/:album_id", AlbumController.albumHandler);

module.exports = router;
