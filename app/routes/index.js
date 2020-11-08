module.exports = function (app) {
  app.use("/auth", require("./auth/auth.router"));
  app.use("/music", require("./music/music.router"));
  app.use("/reports", require("./reports/reports.router"));
  app.use("/tasks", require("./tasks/tasks.router"));

  app.get("/", (req, res) => {
    res.redirect("/music");
  });
};
