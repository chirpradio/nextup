const router = require("express").Router();
const {
  validateLimit,
  validateOffset,
  validateTag,
  validateTags,
  validateTimestamp,
  validateTrackNum,
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

router.patch(
  "/:album_id/track/:track_num",
  validateTrackNum,
  validateTags,
  checkErrors,
  controller.updateTrack
);

router.patch(
  "/:album_id",
  validateTags,
  checkErrors,
  controller.updateAlbumTags
)

module.exports = router;
