const router = require("express").Router();
const passport = require("passport");
const slowDown = require("express-slow-down");
const AuthController = require("./auth.controller");

router.get("/login", AuthController.loginGetHandler);

router.post(
  "/login",
  slowDown({
    windowMs: 15 * 60 * 1000, // Every 15 minutes
    delayAfter: 5, // allow 5 requests to go at full-speed, then...
    delayMs: 500, // 6th request has a 500ms delay, 7th has a 1000ms delay, etc.
  }),
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", AuthController.logoutHandler);

module.exports = router;
