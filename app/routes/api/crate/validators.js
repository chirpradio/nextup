const { body, param, query } = require("express-validator");

module.exports = {
  validateName: body("name").optional().isString(),
  validateId: param("id").isInt({ min: 0 }).toInt(),
  validateIndex: param("index").isInt({ min: 0 }).toInt(),
  validateNewIndex: param("newIndex").isInt({ min: 0 }).toInt(),
  validatePath: body("path").optional().isArray(),
  validateItem: body("item").optional().isObject(),
  validateBodyIndex: body("index").optional().isInt({ min: 0 }).toInt(),
};
