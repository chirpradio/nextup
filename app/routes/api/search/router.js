const router = require("express").Router();
const {
  validateAsYouType,
  validateLimit,
  validateOffset,
} = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

router.get(
  "/",
  validateAsYouType,
  validateLimit,
  validateOffset,
  checkErrors,
  controller.handleSearch
);

module.exports = router;
