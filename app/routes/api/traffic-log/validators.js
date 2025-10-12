const { query } = require("express-validator");
const { SPOT_TYPES } = require("../../config/constants");

module.exports = {
  validateDow: query("dow").optional().isInt({ min: 1, max: 7 }).toInt(),
  validateHour: query("hour").optional().isInt({ min: 0, max: 23 }).toInt(),
  validateGreylist: query("greylist")
    .optional()
    .custom((value) => {
      if (typeof value === "string") {
        return true;
      }
      if (Array.isArray(value)) {
        return value.every((id) => typeof id === "string");
      }
      throw new Error("greylist must be a string or an array of strings");
    })
    .toArray(),
  validateStart: query("start").isISO8601(),
  validateEnd: query("end").isISO8601(),
  validateSpotType: query("spot_type").optional().isString().trim().isIn(SPOT_TYPES),
  validateUnderwriter: query("underwriter").optional().isString().trim(),
};
