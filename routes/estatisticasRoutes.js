import express from "express";
import {
    atualizarEstatisticas,
    obterEstatisticasPerfil
} from "../controllers/estatisticasController.js";

const router = express.Router();

router.get("/perfil", obterEstatisticasPerfil);
router.post("/", atualizarEstatisticas);

export default router;