import express from "express";

import {
    iniciarJogoSp,
    submeterResposta,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/jogoSingleplayer", iniciarJogoSp);

router.post("/guess", submeterResposta);

export default router;