const router = require("express").Router();
const SearchController = require("./search.controller");

router.get("/", SearchController.indexHandler);
router.get("/:type", SearchController.typeHandler);

module.exports = router;
