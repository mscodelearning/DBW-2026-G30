import express from "express";
import {
    atualizarEstatisticas,
    obterEstatisticasPerfil
} from "../controllers/estatisticasController.js";

const router = express.Router();

// rotas responsaveis pela consulta e atualizacao das estatisticas do utilizador

// obtem as estatisticas associadas ao perfil do user
router.get("/perfil", obterEstatisticasPerfil);

// atualiza as estatisticas do user
router.post("/", atualizarEstatisticas);

export default router;