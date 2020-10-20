const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const session = require("express-session");
const { Datastore } = require("@google-cloud/datastore");
const { DatastoreStore } = require("@google-cloud/connect-datastore");
const { User } = require("../models");

module.exports = function configureAuth(app) {
  passport.use(
    new Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        let user;
        try {
          user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false);
          }

          if (user.authenticate(password)) {
            return done(null, user);
          } else {
            req.flash("errorMessages", ["Invalid username or password"]);
            return done(null, false);
          }
        } catch (err) {
          req.flash("errorMessages", ["Invalid username or password"]);
          return done(null, false);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(async function (email, done) {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(new Error("user not found"));
      }
      done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: new DatastoreStore({
        kind: "express-sessions",
        expirationMs: 36000000, // 1 hour
        dataset: new Datastore({}),
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.all("*", function requireAuth(req, res, next) {
    const exemptPaths = ["/auth/login", "/auth/logout", "/favicon.ico"];
    const desiredUrl = req.originalUrl;
    const canContinue = req.isAuthenticated() || exemptPaths.includes(desiredUrl) || desiredUrl.startsWith("/tasks");

    if (canContinue) {
      next();
    } else {
      req.session.desiredUrl = desiredUrl;
      res.redirect("/auth/login");
    }
  });
};
