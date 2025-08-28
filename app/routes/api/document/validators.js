const { datastore, parseIndexerTransaction } = require("../../../db");
const { body, param } = require("express-validator");

function toKey(value) {
  const path = parseIndexerTransaction(value);
  return datastore.key(path);
}

module.exports = {
  validateAuthor: body("author").optional().isArray().customSanitizer(toKey),
  validateAuthorName: body("author_name").optional().isString(),
  validateDoctype: body("doctype").isIn(["review", "comment"]),
  validateId: param("id").isInt({ min: 1 }),
  validateDocumentKey: body("__key").isArray().customSanitizer(toKey),
  validateSubject: body("subject").isArray().customSanitizer(toKey),
  validateUnsafeText: body("unsafe_text").isString().trim(),
};
