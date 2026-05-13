import express from "express";
import { isLoggedIn } from "../controllers/userController.js";
import Sala from "../models/sala.js";
const router = express.Router();

/*
router.get("/perfilPage", (req, res) => {
  res.render("perfil");
});

router.get("/selectMultiplayerPage", (req, res) => {
  res.render("selectMultiplayerPage");
});
*/
/*
router.get("/perfilPage", isLoggedIn, (req, res) => {
  res.render("perfil", { user: req.user });
});
*/

router.get("/selectMultiplayerPage", isLoggedIn, (req, res) => {
  res.render("selectMultiplayerPage");
});

/*
router.get("/alterarPalavraPasse", (req, res) => {
  res.render("alteraPalavraPasse");
});*/

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

/*
router.get("/signup", (req, res) => {
  res.render("signupPage");
});*/

router.get("/signup", (req, res) => {
  res.render("signupPage", { error: null });
});

router.get("/gameSinglePlayer", (req, res) => {
  res.render("gamemodeSingleplayer");
});

router.get("/gameMultiplayerPlayer", (req, res) => {
  res.render("gamemodeMultiplayer");
});

/*
router.get("/jogoSingleplayer", (req, res) => {
  res.render("jogoSingleplayer");
});*/

router.get("/fimJogoSp", (req, res) => {
  res.render("fimDeJogoSp");
});

router.get("/fimJogoMp", (req, res) => {
  res.render("fimDeJogoMp");
});

router.get("/salasPrivadas", (req, res) => {
  res.render("salaPrivada");
});

router.get("/paginaCriaSala", (req, res) => {
  res.render("criaSalaPage");
});

/*
router.get("/paginaSalasPublicas", (req, res) => {
  res.render("salasPublicasPage");
});*/

/*
router.get("/paginaSalasPublicas", isLoggedIn, (req, res) => {
  res.render("salasPublicasPage");
});
*/


router.get("/paginaJogoMultiplayer", (req, res) => {
  res.render("jogoMultiplayer");
});

router.get("/paginaSalasPublicas", isLoggedIn, async (req, res) => {
  try {
    const salasPublicas = await Sala.find({
      "configuracoes.access": "Público"
    })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    res.render("salasPublicasPage", {
      salasPublicas,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar salas públicas.");
  }
});

export default router;