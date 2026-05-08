import User from "../models/userModel.js";

export const getSignup = (req, res) => {
  res.render("signupPage", { error: null });
};

export const postSignup = async (req, res) => {
  try {
    const { username, nickname, password } = req.body;

    if (!username || !nickname || !password) {
      return res.render("signupPage", {
        error: "Preenche todos os campos.",
      });
    }

    const newUser = new User({ username, nickname });
    await User.register(newUser, password);

    res.redirect("/login");
  } catch (err) {
    res.render("signupPage", {
      error: "Username ja existe! \n Tente novamente.",
    });
  }
};

export const getLogin = (req, res) => {
  res.render("loginPage", { error: null });
};

export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
