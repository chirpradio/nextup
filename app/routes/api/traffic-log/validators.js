const { query } = require("express-validator");

module.exports = {
  validateDow: query("dow").optional().isInt({ min: 1, max: 7 }).toInt(),
  validateHour: query("hour").optional().isInt({ min: 0, max: 23 }).toInt(),
  validateStart: query("start").isISO8601(),
  validateEnd: query("end").isISO8601(),
};
