const router = require("express").Router();
const controller = require("./controller");
const {
  validateAlbum,
  validateArtist,
  validateCategories,
  validateEnd,
  validateLabel,
  validateRole,
  validateStart,
  validateTrack,
  validateFreeformTrackTitle,
} = require("./validators");
const { checkErrors } = require("../errors");

router.get(
  "/",
  validateStart,
  validateEnd,
  checkErrors,
  controller.getPlaylistEvents
);

router.post("/break", validateRole, checkErrors, controller.postPlaylistBreak);

router.post(
  "/track",
  validateRole,
  validateAlbum,
  validateArtist,
  validateCategories,
  validateLabel,
  validateTrack,
  checkErrors,
  controller.postPlaylistTrack
);

router.post(
  "/freeform",
  validateRole,
  validateCategories,
  validateFreeformTrackTitle,
  checkErrors,
  controller.postFreeformPlaylistTrack
);

router.get(
  "/rotation",
  validateStart,
  validateEnd,
  checkErrors,
  controller.getRotationPlays
);

module.exports = router;
