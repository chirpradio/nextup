const router = require("express").Router();
const { validateEnd, validateStart } = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

router.get("/", controller.getLog);

router.post("/", controller.addEntry);

router.get(
  "/report",
  validateStart,
  validateEnd,
  checkErrors,
  controller.exportLog
);

module.exports = router;
