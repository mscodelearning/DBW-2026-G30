import express from "express";
const router = express.Router();

router.get("/perfilPage", (req, res) => {
  res.render("perfil");
});

router.get("/selectMultiplayerPage", (req, res) => {
  res.render("selectMultiplayerPage");
});

router.get("/alterarPassword", (req, res) => {
  res.render("alteraPalavraPasse");
});

router.get("/", (req, res) => {
  res.render("paginaInicial");
});

router.get("/tutorial", (req, res) => {
  res.render("tutorialPage");
});

router.get("/login", (req, res) => {
  res.render("loginPage");
});



router.get("/signin", (req, res) => {
  res.render("signinPage");
});

router.get("/tutorial", (req, res) => {
  res.render("tutorialPage");
});

router.get("/gamemodeMultiplayer", (req, res) => {
  res.render("gamemodeMultiplayer");
});




export default router;