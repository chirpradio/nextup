const router = require("express").Router();
const CrateController = require("./crate.controller");

router.get("/", CrateController.indexHandler);
router.post("/", CrateController.postHandler);

router.get("/:crate_id", CrateController.getHandler);
router.patch("/:crate_id", CrateController.patchHandler);
router.delete("/:crate_id", CrateController.deleteHandler);

router.post("/:crate_id/items", CrateController.postItemsHandler);
router.get(
  "/:crate_id/items/:index/delete",
  CrateController.deleteItemsHandler
);

module.exports = router;
