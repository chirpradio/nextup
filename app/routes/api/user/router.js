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

function createUserAccessMiddleware(allowSelfAccess = false) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(403).json({
        error: "Forbidden: Authentication required",
      });
    }

    // Check if user has management privileges
    const hasManagementAccess =
      req.user.is_superuser || req.user.isVolunteerCoordinator();

    if (hasManagementAccess) {
      return next();
    }

    // If self access is allowed, check if user is accessing their own record
    if (allowSelfAccess && req.params.id) {
      const targetUserId = parseInt(req.params.id, 10);
      const currentUserId = parseInt(req.user.entityKey.id, 10);

      if (targetUserId === currentUserId) {
        return next();
      }
    }

    const errorMessage = allowSelfAccess
      ? "Forbidden: Can only update your own profile or requires management access"
      : "Forbidden: Superuser or volunteer coordinator access required";

    return res.status(403).json({
      error: errorMessage,
    });
  };
}

const requireUserManagementAccess = createUserAccessMiddleware(false);
const requireUserManagementOrSelfAccess = createUserAccessMiddleware(true);

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
  requireUserManagementOrSelfAccess,
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
