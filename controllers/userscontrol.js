const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const RegsiterdUser = await User.register(user, password);
    req.login(RegsiterdUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Successsfully created an account!!");
      return res.redirect("/stadiums");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Successfully Logged in!!");
  var redirectUrl = req.session.returnTo || "/stadiums";
  delete req.session.returnTo;
  if (redirectUrl === "/fafaf") {
    redirectUrl = "/stadiums";
  }
  console.log(redirectUrl);
  return res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Successfully Logged Out!!");
  return res.redirect("/stadiums");
};
