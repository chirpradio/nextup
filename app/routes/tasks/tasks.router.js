const express = require("express");
const router = express.Router();
const TaskController = require("./tasks.controller");

router.use(express.json());

function validateCronRequest(req, res, next) {
  /* log the details of a cron request so they can 
  be confirmed and secured around */
  req.log.info("Cron request");
  next();
}

router.post("/reindex/album/:album_id", TaskController.reindexAlbumHandler);
router.post("/reindex/tags/:index/:id", TaskController.reindexTagsHandler);
router.get(
  "/rotation/plays",
  validateCronRequest,
  TaskController.updateFreeformRotationPlays
);

module.exports = router;
