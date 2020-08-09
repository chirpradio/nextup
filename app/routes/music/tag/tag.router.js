const router = require("express").Router();
const TagController = require("./tag.controller");

router.get("/:tag", TagController.indexHandler);

module.exports = router;
