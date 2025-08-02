const { body } = require("express-validator");

module.exports = {
  validateUserCreation: [
    body("email")
      .isEmail()      
      .withMessage("Must provide a valid email address"),
    body("first_name")
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("First name is required and must be 1-100 characters"),
    body("last_name")
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Last name is required and must be 1-100 characters"),
    body("dj_name")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 })
      .withMessage("DJ name must be less than 100 characters"),
    body("roles")
      .optional()
      .isArray()
      .withMessage("Roles must be an array"),
    body("roles.*")
      .optional()
      .isIn(["dj", "music_director", "traffic_log_admin", "reviewer", "volunteer_coordinator"])
      .withMessage("Invalid role specified"),
  ],
};