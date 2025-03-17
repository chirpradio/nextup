const router = require("express").Router();
const {
  validateEnd,
  validateStart,
  validateDow,
  validateHour,
} = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

router.get("/", validateDow, validateHour, checkErrors, controller.getLog);

router.post("/", controller.addEntry);

router.get(
  "/report",
  validateStart,
  validateEnd,
  checkErrors,
  controller.exportLog
);

module.exports = router;
