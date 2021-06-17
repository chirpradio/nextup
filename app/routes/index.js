module.exports = function (app) {
  app.use("/api", require("./api/api.router"));
  app.use("/tasks", require("./tasks/tasks.router"));
};
