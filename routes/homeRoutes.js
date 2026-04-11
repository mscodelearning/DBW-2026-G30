import express from "express";
const router = express.Router();

router.get("/perfilPage", (req, res) => {
  res.render("perfil");
});

router.get("/selectMultiplayerPage", (req, res) => {
  res.render("selectMultiplayerPage");
});

router.get("/alterarPalavraPasse", (req, res) => {
  res.render("alteraPalavraPasse");
});

/*/paginaInicial*/
router.get("/", (req, res) => {
  res.render("paginaInicial");
});

router.get("/tutorial", (req, res) => {
  res.render("tutorialPage");
});

router.get("/login", (req, res) => {
  res.render("loginPage");
});



router.get("/signup", (req, res) => {
  res.render("signupPage");
});

router.get("/tutorial", (req, res) => {
  res.render("tutorialPage");
});


router.get("/gameSinglePlayer", (req, res) => {
  res.render("gamemodeSingleplayer");
});

router.get("/gameMultiplayerPlayer", (req, res) => {
  res.render("gamemodeMultiplayer");
});

router.get("/jogoSingleplayer", (req, res) => {
  res.render("jogoSingleplayer");
});



export default router;