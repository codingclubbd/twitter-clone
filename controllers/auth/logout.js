const logout = (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
};

module.exports = logout;
