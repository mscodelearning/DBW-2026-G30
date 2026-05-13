import { criarNovaSala, entrarNaSala, sairDaSala } from "../services/multiplayerService.js";
import Sala from "../models/sala.js";


export async function criarSala(req, res) {

    try {

        const sala = await criarNovaSala(
            req.body,
            req.user
        );

        res.status(201).json({
            sucesso: true,
            codigo: sala.codigo,
            sala
        });

    } catch (err) {

        res.status(400).json({
            sucesso: false,
            erro: err.message
        });

    }

}


export async function carregarSala(req, res) {
    try {

        const codigoSala = req.params.codigo.toUpperCase();

        const sala = await Sala.findOne({ codigo: codigoSala });

        // se a sala nao existir da erro
        if (!sala) {
            return res.status(404).send("Sala não encontrada ou código inválido.");
        }

        /*res.render("salaPrivada", { sala: sala });*/
        res.render("salaPrivada", {
            sala,
            user: req.user
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro no servidor ao carregar a sala.");
    }
}

export async function entrarSala(req, res) {
    
    try {
        const codigo = req.params.codigo;
        const sala = await entrarNaSala(
            codigo,
            req.user
        );

        res.status(200).json({
            sucesso: true,
            codigo: sala.codigo,
            sala
        });

    } catch (err) {
        res.status(400).json({
            sucesso: false,
            erro: err.message
        });
    }
}

export async function sairSala(req, res) {

    try {

        const codigo = req.params.codigo;

        const sala = await sairDaSala(
            codigo,
            req.user._id
        );

        res.status(200).json({
            sucesso: true,
            sala
        });

    } catch (err) {

        res.status(400).json({
            sucesso: false,
            erro: err.message
        });

    }
}