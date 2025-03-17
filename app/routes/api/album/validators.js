const { body, query, param } = require("express-validator");
const { CURRENT_TAGS } = require("../../../config/constants");

module.exports = {
  validateLimit: query("limit").optional().isInt({ min: 1, max: 100 }),
  validateOffset: query("offset").optional().isInt(),
  validateTag: query("tag").isIn(CURRENT_TAGS),
  validateTags: body("tags").isArray(),
  validateTimestamp: query("timestamp").optional().isInt(),
  validateTrackNum: param("track_num").isInt({ min: 0 }).toInt(),
};
