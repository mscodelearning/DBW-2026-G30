import express from "express";

import {
    iniciarJogoSp,
    submeterResposta,
} from "../controllers/gameController.js";

const router = express.Router();

// rotas do modo singleplayer

// inicia uma nova sessao de jogo singleplayer
router.get("/jogoSingleplayer", iniciarJogoSp);

// submete uma resposta do jogador durante o jogo
router.post("/guess", submeterResposta);

export default router;