const router = require("express").Router();
const controller = require("./controller");
const { validateId, validateIndex, validateName, validateNewIndex, validatePath, validateItem, validateBodyIndex } = require("./validators");
const { checkErrors } = require("../errors");

router.get("/", controller.listCrates);

router.post("/", validateName, controller.addCrate);

router.get(
  "/:id",
  validateId,
  controller.getCrateAndCheckAuth,
  checkErrors,
  controller.getCrate
);

router.patch(
  "/:id",
  validateId,
  validateName,
  controller.getCrateAndCheckAuth,
  checkErrors,
  controller.renameCrate
);

router.delete(
  "/:id",
  validateId,
  controller.getCrateAndCheckAuth,
  checkErrors,
  controller.deleteCrate
);

router.get(
  "/:id/items",
  validateId,
  controller.getCrateAndCheckAuth,
  checkErrors,
  controller.getCrateItems
);

router.post(
  "/:id/item",
  validateId,
  validatePath,
  validateItem,
  validateBodyIndex,
  controller.getCrateAndCheckAuth,
  checkErrors,
  controller.addItem,
  controller.getCrateAndCheckAuth,
  controller.getCrateItems
);

router.delete(
  "/:id/item/:index",
  validateId,
  validateIndex,
  controller.getCrateAndCheckAuth,
  checkErrors,
  controller.removeItem
);

router.patch(
  "/:id/item/:index/reorder/:newIndex",
  validateId,
  validateIndex,
  validateNewIndex,
  controller.getCrateAndCheckAuth,
  checkErrors,
  controller.reorderItem
);

module.exports = router;
