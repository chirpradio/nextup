const router = require("express").Router();
const {
  validateEnd,
  validateStart,
  validateDow,
  validateHour,
  validateGreylist,
  validateSpotId,
  validateUnderwriter,
} = require("./validators");
const { checkErrors } = require("../errors");
const controller = require("./controller");

function requireTrafficLogAdminAccess(req, res, next) {
  if (
    !req.user ||
    (!req.user.is_superuser && !req.user.roles?.includes('traffic_log_admin'))
  ) {
    return res.status(403).json({
      error: "Forbidden: Traffic log admin access required",
    });
  }
  next();
}

router.get(
  "/",
  validateDow,
  validateHour,
  validateGreylist,
  checkErrors,
  controller.getLog
);

router.post("/", controller.addEntry);

router.get(
  "/report",
  requireTrafficLogAdminAccess,
  validateStart,
  validateEnd,
  validateSpotId,
  validateUnderwriter,
  checkErrors,
  controller.exportLog
);

module.exports = router;
