const { param } = require("express-validator");
const { errorMessages } = require("./errors");

const authorizeTrafficLogAdmins = function (req, res, next) {
  try {
    if (req.user.isTrafficLogAdmin()) {
      next();
    } else {
      throw new Error(errorMessages.FORBIDDEN);
    }
  } catch (error) {
    next(error);
  }
};

const validateId = param("id").isInt({ min: 0 }).toInt();

module.exports = {
  authorizeTrafficLogAdmins,
  validateId,
};
