import express from "express";
import passport from "passport";
import { getSignup, postSignup, getLogin, isLoggedIn } from "../controllers/userController.js";

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

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});



export default router;