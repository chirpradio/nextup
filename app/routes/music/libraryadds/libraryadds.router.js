const router = require("express").Router();
const LibraryAddsController = require("./libraryadds.controller");

router.get("/", LibraryAddsController.indexHandler);

module.exports = router;
