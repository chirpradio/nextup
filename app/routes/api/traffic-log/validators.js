const { query } = require("express-validator");

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
};
