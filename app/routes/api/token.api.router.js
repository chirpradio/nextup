const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const { checkErrors } = require("./errors");

router.post(
  "/",
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3,
  }),
  body("email").isEmail(),
  body("password").isString(),
  checkErrors,
  function (req, res, next) {
    passport.authenticate("email-password", { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }
        const body = {
          entityKey: user.entityKey,
          email: user.email,
          roles: user.roles,
          first_name: user.first_name,
          last_name: user.last_name,
          is_superuser: user.is_superuser,
        };
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: "6h",
        });
        return res.json({ token });
      });
    })(req, res, next);
  }
);

module.exports = router;
