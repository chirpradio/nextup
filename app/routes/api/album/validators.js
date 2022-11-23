const { query } = require("express-validator");

const validateLimit = query("limit").optional().isInt({ min: 1, max: 100 });
const validateOffset = query("offset").optional().isInt();
const validateTag = query("tag").isIn([
  "heavy_rotation",
  "light_rotation",
  "local_current",
  "local_classic",
]);
const validateTimestamp = query("timestamp").optional().isInt();

module.exports = {
  validateLimit,
  validateOffset,
  validateTag,
  validateTimestamp,
};
