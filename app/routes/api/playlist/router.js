const router = require("express").Router();
const controller = require("./controller");
const {
  validateAlbum,
  validateArtist,
  validateCategories,
  validateDateSpan,
  validateEnd,
  validateLabel,
  validateMusicDirectorRole,
  validateReportEnd,
  validateReportStart,
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

router.delete("/:id", validateRole, checkErrors, controller.deleteTrack);

router.patch("/:id", validateRole, checkErrors, controller.updateTrack);

router.get(
  "/rotation",
  validateStart,
  validateEnd,
  checkErrors,
  controller.getRotationPlays
);

router.get(
  "/report",
  validateMusicDirectorRole,
  validateReportStart,
  validateReportEnd,
  validateDateSpan,
  checkErrors,
  controller.exportPlaylistReport
);

module.exports = router;
