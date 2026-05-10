import { criarNovaSala } from "../services/multiplayerService.js";
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

        const codigoSala = req.params.codigo;

        const sala = await Sala.findOne({ codigo: codigoSala });

        // se a sala nao existir da erro
        if (!sala) {
            return res.status(404).send("Sala não encontrada ou código inválido.");
        }

        res.render("salaPrivada", { sala: sala });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro no servidor ao carregar a sala.");
    }
}