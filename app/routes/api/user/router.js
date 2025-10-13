const router = require("express").Router();
const { body, param } = require("express-validator");
const {
  emailValidator,
  validateUserCreation,
  firstNameValidator,
  lastNameValidator,
  djNameValidator,
  roleArrayValidator,
  roleValidator,
} = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");
const rateLimit = require("express-rate-limit");
const passport = require("passport");

const authenticate = passport.authenticate(["jwt"], {
  session: false,
});

function requireUserManagementAccess(req, res, next) {
  if (
    !req.user ||
    (!req.user.is_superuser && !req.user.isVolunteerCoordinator())
  ) {
    return res.status(403).json({
      error: "Forbidden: Superuser or volunteer coordinator access required",
    });
  }
  next();
}

router.get(
  "/",
  authenticate,
  controller.listUsers
);

router.post(
  "/",
  authenticate,
  requireUserManagementAccess,
  validateUserCreation,
  checkErrors,
  controller.createUser
);

router.post(
  "/change-password",
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3,
  }),
  body("email").isEmail(),
  body("currentPassword").isString(),
  body("newPassword").isString().isLength({ min: 12 }),
  checkErrors,
  controller.changePassword
);

router.patch(
  "/:id",
  authenticate,
  requireUserManagementAccess,
  param("id").isNumeric(),
  emailValidator.optional(),
  firstNameValidator.optional(),
  lastNameValidator.optional(),
  djNameValidator,
  roleArrayValidator,
  roleValidator,
  body("is_active").optional().isBoolean(),
  checkErrors,
  controller.updateUser
);

module.exports = router;
