const { query } = require("express-validator");

const validateAsYouType = query("as_you_type")
  .optional()
  .isBoolean()
  .toBoolean();
const validateLimit = query("limit")
  .optional()
  .isInt({ min: 1, max: 100 })
  .toInt();
const validateOffset = query("offset").optional().isInt({ min: 0 }).toInt();

module.exports = {
  validateAsYouType,
  validateLimit,
  validateOffset,
};
