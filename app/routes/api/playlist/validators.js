const { datastore, parseIndexerTransaction } = require("../../../db");
const { body, query } = require("express-validator");
const { errorMessages } = require("../errors");

function toKey(value) {
  const path = parseIndexerTransaction(value);
  return datastore.key(path);
}

const validateEnd = query("end").optional().isInt().toInt();
const validateStart = query("start").optional().isInt().toInt();
const validateReportStart = query("start").isISO8601();
const validateReportEnd = query("end").isISO8601();
const validateDateRange = function (req, res, next) {
  try {
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);
    const diffInMs = endDate - startDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const MAX_DATE_RANGE_IN_DAYS = 100;
    
    if (diffInDays > MAX_DATE_RANGE_IN_DAYS) {
      return res.status(400).json({
        error: `Date range cannot exceed ${MAX_DATE_RANGE_IN_DAYS} days`
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
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
const validateMusicDirectorRole = function (req, res, next) {
  try {
    if (req.user.isMusicDirector()) {
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
  validateDateRange,
  validateEnd,
  validateFreeformTrackTitle,
  validateLabel,
  validateMusicDirectorRole,
  validateReportEnd,
  validateReportStart,
  validateRole,
  validateStart,
  validateTrack,
};
