import express from "express";

import {
    criarSala,
    carregarSala
} from "../controllers/multiplayerController.js";

const router = express.Router();

router.post(
    "/criarSala",
    criarSala
);

router.get("/sala/:codigo", carregarSala);

export default router;