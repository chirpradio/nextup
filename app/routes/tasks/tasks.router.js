const express = require("express");
const router = express.Router();
const TaskController = require("./tasks.controller");

router.use(express.json());

function validateCronRequest(req, res, next) {
  console.log("X-Appengine-Cron", req.get("X-Appengine-Cron"));
  console.log("IP", req.ip);
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
