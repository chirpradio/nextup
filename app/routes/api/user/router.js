const router = require("express").Router();
const { validateUserCreation } = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");


function requireSuperuser(req, res, next) {
  if (!req.user || !req.user.is_superuser) {
    return res.status(403).json({
      error: "Forbidden: Superuser access required"
    });
  }
  next();
}

router.get(
  "/",
  requireSuperuser,
  controller.listUsers
);

router.post(
  "/",
  requireSuperuser,
  validateUserCreation,
  checkErrors,
  controller.createUser
);

module.exports = router;