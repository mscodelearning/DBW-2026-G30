import express from "express";
import { isLoggedIn } from "../controllers/userController.js";
import Sala from "../models/sala.js";
const router = express.Router();

// rotas responsaveis pela navegacao e renderizacao das paginas da aplicacao

// pagina de selecao do modo multiplayer acessivel apenas a users autenticados
router.get("/selectMultiplayerPage", isLoggedIn, (req, res) => {
  res.render("selectMultiplayerPage");
});

// pagina inicial da aplicacao
router.get("/", (req, res) => {
  res.render("paginaInicial");
});

// pagina do tutorial
router.get("/tutorial", (req, res) => {
  res.render("tutorialPage");
});

// pagina do login
router.get("/login", (req, res) => {
  res.render("loginPage");
});

// pagina do registo
router.get("/signup", (req, res) => {
  res.render("signupPage", { error: null });
});

// pagina do modo singleplayer
router.get("/gameSinglePlayer", (req, res) => {
  res.render("gamemodeSingleplayer");
});

// pagina entrada do modo multiplayer
router.get("/gameMultiplayerPlayer", (req, res) => {
  res.render("gamemodeMultiplayer");
});

// pagina de fim de jogo do modo singleplayer
router.get("/fimJogoSp", (req, res) => {
  res.render("fimDeJogoSp");
});

// pagina de fim de jogo do modo multiplayer
router.get("/fimJogoMp", (req, res) => {
  res.render("fimDeJogoMp");
});

//pagina de gestao de salas privadas
router.get("/salasPrivadas", (req, res) => {
  res.render("salaPrivada");
});

// pagina de criacao dde sala
router.get("/paginaCriaSala", (req, res) => {
  res.render("criaSalaPage");
});

// pagina principal do jogo multiplayer
router.get("/paginaJogoMultiplayer", (req, res) => {
  res.render("jogoMultiplayer");
});

// pagina que lista as salas publicas disponiveis
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

// pagina sobre com mais informacoes para alem do jogo em si
router.get("/AboutPg", (req, res) => {
  res.render("AboutPage");
});

export default router;