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


router.get("/alterarPalavraPasse", isLoggedIn, (req, res) => {
  res.render("alteraPalavraPasse", { error: null });
});

router.post("/alterarPassword", isLoggedIn, async (req, res) => {
    console.log("POST /alterarPassword reached");
  console.log("BODY:", req.body);
  try {
    const { atual, nova, confirmar } = req.body;

    if (!atual || !nova || !confirmar) {
      return res.render("alteraPalavraPasse", {
        error: "Preenche todos os campos."
      });
    }

    if (nova !== confirmar) {
      return res.render("alteraPalavraPasse", {
        error: "A nova palavra-passe e a confirmação não coincidem."
      });
    }

    await req.user.changePassword(atual, nova);

    res.redirect("/perfilPage");
  } catch (err) {
    console.log(err);
    res.render("alteraPalavraPasse", {
      error: "A palavra-passe atual está incorreta."
    });
  }
});

export default router;