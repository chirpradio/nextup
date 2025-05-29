const router = require("express").Router();
const {
  validateAuthor,
  validateAuthorName,
  validateDoctype,
  validateSubject,
  validateUnsafeText,
} = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

router.post(
  "/",
  validateAuthor,
  validateAuthorName,
  validateDoctype,
  validateSubject,
  validateUnsafeText,
  checkErrors,
  controller.createDocument
);

module.exports = router;
