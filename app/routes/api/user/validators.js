const { body } = require("express-validator");
const { ROLES } = require("../../../config/constants");

const emailValidator = body("email")
  .isEmail()
  .withMessage("Must provide a valid email address");
const firstNameValidator = body("first_name")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("First name must be 1-100 characters");
const lastNameValidator = body("last_name")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Last name must be 1-100 characters");
const djNameValidator = body("dj_name")
  .optional()
  .isString()
  .trim()
  .isLength({ max: 100 })
  .withMessage("DJ name must be less than 100 characters");
const roleArrayValidator = body("roles")
  .optional()
  .isArray()
  .withMessage("Roles must be an array");
const roleValidator = body("roles.*")
  .optional()
  .isIn(ROLES)
  .withMessage("Invalid role specified");

module.exports = {
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  djNameValidator,
  roleArrayValidator,
  roleValidator,
  validateUserCreation: [
    emailValidator,
    firstNameValidator,
    lastNameValidator,
    djNameValidator,
    roleArrayValidator,
    roleValidator,
  ],
};
