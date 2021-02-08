const { ensureLoggedIn } = require("connect-ensure-login");

module.exports = function (app) {
  app.use("/api", require("./api/api.router"));
  app.use("/auth", require("./auth/auth.router"));
  app.use(
    "/music",
    ensureLoggedIn("/auth/login"),
    require("./music/music.router")
  );
  app.use(
    "/reports",
    ensureLoggedIn("/auth/login"),
    require("./reports/reports.router")
  );
  app.use("/tasks", require("./tasks/tasks.router"));

  app.get("/", (req, res) => {
    res.redirect("/music");
  });
};
