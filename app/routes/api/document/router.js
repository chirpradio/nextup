const router = require("express").Router();
const {
  validateAuthor,
  validateAuthorName,
  validateDoctype,
  validateDocumentKey,
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

router.patch(
  "/",
  validateDocumentKey,
  validateUnsafeText,
  checkErrors,
  controller.getDocumentAndRequireEditAccess,
  controller.updateDocument
);

module.exports = router;
