const router = require("express").Router();
const SearchController = require("./search.controller");

router.get("/", SearchController.indexHandler);
router.get("/update_albums", SearchController.updateAlbumsHandler);
router.get("/update_tags", SearchController.updateTagsHandler);
router.get("/:type", SearchController.typeHandler);

module.exports = router;
