const router = require("express").Router();
const { query } = require("express-validator");
const { checkErrors } = require("../errors");
const controller = require("./controller");

const validateStart = query("start").isISO8601();
const validateEnd = query("end").isISO8601();

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
