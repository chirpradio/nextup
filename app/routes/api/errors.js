const { validationResult } = require("express-validator");

const errorMessages = {
  BAD_REQUEST: "Bad request",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not found",
  UNAUTHORIZED: "Unauthorized",
  INVALID_CREDENTIALS: "Invalid username or password",
};

function checkErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
}

function sendErrorCode(error, req, res) {
  req.log.error(error);

  if (!res.headersSent) {
    let code = 500;

    if (
      error.message === errorMessages.BAD_REQUEST ||
      error.code === "ERR_VALIDATION"
    ) {
      code = 400;
    }
    if (error.message === errorMessages.UNAUTHORIZED) {
      code = 401;
    }
    if (error.message === errorMessages.FORBIDDEN) {
      code = 403;
    }
    if (
      error.code === "ERR_ENTITY_NOT_FOUND" ||
      error.message === errorMessages.NOT_FOUND
    ) {
      code = 404;
    }

    if (error.errors) {
      res.status(code).json(error.errors);
    } else {
      res.sendStatus(code);
    }
  }
}

module.exports = {
  checkErrors,
  errorMessages,
  sendErrorCode,
};
