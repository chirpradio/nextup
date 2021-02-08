const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/", function (req, res, next) {
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
});

module.exports = router;
