const router = require("express").Router();
const {
  validateLimit,
  validateOffset,
  validateTag,
  validateTimestamp,
} = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

router.get(
  "/tag",
  validateTag,
  validateLimit,
  validateOffset,
  checkErrors,
  controller.getAlbumsWithTag
);

router.get(
  "/recent",
  validateTimestamp,
  validateLimit,
  validateOffset,
  checkErrors,
  controller.getRecentAlbums
);

router.get("/:album_id", controller.getAlbumById);

module.exports = router;
