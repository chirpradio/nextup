const router = require("express").Router();
const { query } = require("express-validator");
const { authorizeTrafficLogAdmins, validateId } = require("../validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

const validateActive = query("active").optional().toBoolean();

router.get("/", validateActive, checkErrors, controller.getSpots);

router.post("/", authorizeTrafficLogAdmins, checkErrors, controller.addSpot);

router.get("/:id", validateId, checkErrors, controller.getSpot);

router.patch("/:id", validateId, checkErrors, controller.updateSpot);

router.delete("/:id", validateId, checkErrors, controller.deleteSpot);

router.post(
  "/:id/copy",
  validateId,
  authorizeTrafficLogAdmins,
  checkErrors,
  controller.addCopy
);

router.patch(
  "/copy/:id",
  validateId,
  authorizeTrafficLogAdmins,
  checkErrors,
  controller.updateCopy
);

router.delete(
  "/copy/:id",
  validateId,
  authorizeTrafficLogAdmins,
  checkErrors,
  controller.deleteCopy
);

module.exports = router;
