const router = require("express").Router();
const RotationController = require("./rotation.controller");

router.get("/albums", RotationController.albumsHandler);
router.get("/plays", RotationController.playsHandler);

module.exports = router;
