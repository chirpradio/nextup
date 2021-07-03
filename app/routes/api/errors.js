const { validationResult } = require("express-validator");

const errorMessages = {
  BAD_REQUEST: "Bad request",
  FORBIDDEN: "Forbidden",
};

function checkErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
}

function sendErrorCode(error, req, res, next) {
  console.error(error);
  let code = 500;

  if (error.message === errorMessages.BAD_REQUEST) {
    code = 400;
  }
  if (error.message === errorMessages.FORBIDDEN) {
    code = 403;
  }
  if (error.code === "ERR_ENTITY_NOT_FOUND") {
    code = 404;
  }

  res.sendStatus(code);
}

module.exports = {
  checkErrors,
  errorMessages,
  sendErrorCode,
};
