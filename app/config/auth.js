const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const session = require("express-session");
const { Datastore } = require("@google-cloud/datastore");
const { DatastoreStore } = require("@google-cloud/connect-datastore");
const { User } = require("../models");

module.exports = function configureAuth(app) {
  passport.use(
    "email-password",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        try {
          const user = await User.findOne({ email: email });
          if (user) {
            const passwordMatch = user.authenticate(password);
            if (user.is_active && passwordMatch) {
              req.log.info(
                {
                  email: user.email,
                },
                "authenticated"
              );
              return done(null, user);
            } else {
              req.log.info(
                {
                  email: user.email,
                  is_active: user.is_active,
                  passwordMatch,
                },
                "not authenticated"
              );
              return done(null, false);
            }
          }

          req.log.error(
            {
              email,
            },
            "not authenticated"
          );
          return done(null, false);
        } catch (err) {
          req.log.error(err, email);
          return done(new Error("Unauthorized"), false);
        }
      }
    )
  );

  passport.use(
    "api_key",
    new CustomStrategy(async function (req, done) {
      try {
        if (!req.query.api_key) {
          return done(null, false);
        }

        const user = await User.findOne({ api_key: req.query.api_key });
        if (user && user.is_active) {
          return done(null, user);
        }

        return done(null, false);
      } catch (err) {
        req.log.error(err);
        return done(new Error("Unauthorized"), false);
      }
    })
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
          if (user && user.is_active) {
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
