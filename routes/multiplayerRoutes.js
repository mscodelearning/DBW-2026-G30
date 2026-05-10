import express from "express";

import {
    criarSala,
    carregarSala,
    entrarSala
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

router.get("/sala/:codigo", carregarSala);

export default router;