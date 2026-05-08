import express from "express";
import {
    atualizarEstatisticas,
    obterEstatisticasPerfil
} from "../controllers/estatisticasController.js";

const router = express.Router();

router.get("/perfil", obterEstatisticasPerfil);
router.post("/", atualizarEstatisticas);

//console.log("ESTATISTICAS ROUTES LOADED");

export default router;