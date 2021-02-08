const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const slowDown = require("express-slow-down");

router.post(
  "/",
  slowDown({
    windowMs: 15 * 60 * 1000, // Every 15 minutes
    delayAfter: 3, // allow 3 requests to go at full-speed, then...
    delayMs: 1000, // 6th request has a 1s delay, 7th has a 2s delay, 8th 3s, etc.
  }),
  function (req, res, next) {
    passport.authenticate("local", { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Invalid username or password",
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }
        const body = { email: user.email, roles: user.roles };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: "6h",
        });
        return res.json({ token });
      });
    })(req, res, next);
  }
);

module.exports = router;
