const { query } = require("express-validator");

const validateLimit = query("limit")
  .optional()
  .isInt({ min: 1, max: 100 })
  .toInt();
const validateOffset = query("offset").optional().isInt({ min: 0 }).toInt();

module.exports = {
  validateLimit,
  validateOffset,
};
