import express from "express";

import Sala from "../models/sala.js";
 

import {
    criarSala,
    carregarSala,
    entrarSala,
    sairSala
} from "../controllers/multiplayerController.js";

import { updateNomeSala } from "../controllers/salaController.js";

const router = express.Router();

//rota responsavel pela criacao, entrada, saida e gestao de salas multiplayer
router.post(
    "/criarSala",
    criarSala
);

//permite a um utilizador entrar numa sala atraves do codigo
router.post(
    "/sala/:codigo/entrar",
    entrarSala
);

// permite a um utilizador sair da sala indicada
router.post(
    "/sala/:codigo/sair",
    sairSala
);

//carrega os dados de uma sala atraves do repsetivo codigo
router.get("/sala/:codigo", carregarSala);

// atualiza o nome de uma sala existente
router.put('/sala/:codigo/nome', updateNomeSala);

export default router;