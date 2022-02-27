const { datastore, parseIndexerTransaction } = require("../../../db");
const { body, query } = require("express-validator");
const { errorMessages } = require("../errors");

function toKey(value) {
  const path = parseIndexerTransaction(value);
  return datastore.key(path);
}

const validateEnd = query("end").optional().isInt().toInt();
const validateStart = query("start").optional().isInt().toInt();
const validateAlbum = body("album").isArray().customSanitizer(toKey);
const validateArtist = body("artist").isArray().customSanitizer(toKey);
const validateCategories = body("categories").isArray();
const validateFreeformTrackTitle = body("track.title").isString();
const validateLabel = body("label").isString().optional({ nullable: true });
const validateRole = function (req, res, next) {
  try {
    if (req.user.isDJ() || req.user.isMusicDirector()) {
      next();
    } else {
      throw new Error(errorMessages.FORBIDDEN);
    }
  } catch (error) {
    next(error);
  }
};
const validateTrack = body("track").isArray().customSanitizer(toKey);

module.exports = {
  validateAlbum,
  validateArtist,
  validateCategories,
  validateEnd,
  validateFreeformTrackTitle,
  validateLabel,
  validateRole,
  validateStart,
  validateTrack,
};
