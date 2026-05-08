import express from "express";
import passport from "passport";
import { getSignup, postSignup, getLogin, isLoggedIn } from "../controllers/userController.js";
import User from "../models/userModel.js";

console.log("userRoute file loaded");

const router = express.Router();

router.get("/signup", getSignup);
router.post("/signup", postSignup);

router.get("/login", getLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.redirect("/");
    });
  });
});

router.get("/perfilPage", isLoggedIn, (req, res) => {
  res.render("perfil", { user: req.user });
});


router.post("/perfilPage", isLoggedIn, async (req, res) => {
  console.log("POST /perfilPage in userRoute reached");

  try {
    const { nickname } = req.body;

    if (!nickname || !nickname.trim()) {
      return res.redirect("/perfilPage");
    }

    await User.findByIdAndUpdate(req.user._id, {
      nickname: nickname.trim()
    });

    res.redirect("/perfilPage");
  } catch (err) {
    console.log(err);
    res.redirect("/perfilPage");
  }
});

export default router;