const router = require("express").Router();
const RecentController = require("./recent.controller");

router.get("/", RecentController.indexHandler);

module.exports = router;
