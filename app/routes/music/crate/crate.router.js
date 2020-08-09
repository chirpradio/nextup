const router = require("express").Router();
const CrateController = require("./crate.controller");

router.get("/", CrateController.indexHandler);
router.get("/:crate_id", CrateController.getHandler);
router.post("/:crate_id", CrateController.postHandler);

module.exports = router;
