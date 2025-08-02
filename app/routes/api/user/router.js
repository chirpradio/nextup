const router = require("express").Router();
const { validateUserCreation } = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

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

router.get("/", requireUserManagementAccess, controller.listUsers);

router.post(
  "/",
  requireUserManagementAccess,
  validateUserCreation,
  checkErrors,
  controller.createUser
);

module.exports = router;
