import express from "express";

import {
    criarSala,
    carregarSala,
    entrarSala,
    sairSala
} from "../controllers/multiplayerController.js";

const router = express.Router();

router.post(
    "/criarSala",
    criarSala
);

router.post(
    "/sala/:codigo/entrar",
    entrarSala
);

router.post(
    "/sala/:codigo/sair",
    sairSala
);

router.get("/sala/:codigo", carregarSala);

export default router;