const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("./Users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./Users/login.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message + ". Please try again!");
    res.redirect("/signup");
  }
};

module.exports.login = (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listings";
  req.flash("success", "Welcome back to Wanderlust");
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out");
    res.redirect("/listings");
  });
};
