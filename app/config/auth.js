const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const session = require("express-session");
const { Datastore } = require("@google-cloud/datastore");
const { DatastoreStore } = require("@google-cloud/connect-datastore");
const { User } = require("../models");

module.exports = function configureAuth(app) {
  passport.use(
    new LocalStrategy(
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
            return done(null, false);
          }
        } catch (err) {
          return done(null, false);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async function (jwtPayload, done) {
        try {
          const user = await User.findOne({ email: jwtPayload.user.email });
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
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
};
