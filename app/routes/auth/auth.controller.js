function loginGetHandler(req, res) {
  res.render("auth/login", {
    layout: "without-nav",
    title: "Login - CHIRP NextUp",
  });
}

function loginPostHandler(req, res) {
  const path = req.session.desiredUrl || "/";
  res.redirect(path);
}

function logoutHandler(req, res) {
  req.logout();
  res.redirect("/auth/login");
}

module.exports = {
  loginGetHandler,
  loginPostHandler,
  logoutHandler,
};
