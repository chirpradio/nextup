const express = require("express");
const router = express.Router();
const TaskController = require("./tasks.controller");

router.use(express.json());

router.post("/reindex/album/:album_id", TaskController.reindexAlbumHandler);
router.post("/reindex/tags/:index/:id", TaskController.reindexTagsHandler);
router.post("/rotation/plays", TaskController.updateFreeformRotationPlays);

module.exports = router;
