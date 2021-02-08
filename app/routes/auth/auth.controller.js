function loginGetHandler(req, res) {
  res.render("auth/login", {
    layout: "without-nav",
    title: "Login - CHIRP NextUp",
  });
}

function logoutHandler(req, res) {
  req.logout();
  res.redirect("/auth/login");
}

module.exports = {
  loginGetHandler,
  logoutHandler,
};
