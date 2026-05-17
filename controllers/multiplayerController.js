import { criarNovaSala, entrarNaSala, sairDaSala } from "../services/multiplayerService.js";
import Sala from "../models/sala.js";

/**
 * cria uma nova sala multiplayer com as configurações enviadas pelo utilizador.
 * @param {Object} req Pedido HTTP contendo os dados da sala.
 * @param {Object} res Resposta HTTP enviada ao cliente.
 * @returns {Promise<void>}
 */
export async function criarSala(req, res) {

    try {

        const sala = await criarNovaSala(
            req.body, //configurações da sala enviadas pelo frontend
            req.user  //utilizador autenticado que cria a sala
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

/**
 * carrega uma sala multiplayer privada através do código da sala
 * verifica autenticação, adiciona o user à sala e renderiza a página da sala privada.
 * @param {Object} req Pedido HTTP contendo o código da sala nos parâmetros.
 * @param {Object} res Resposta HTTP utilizada para renderização.
 * @returns {Promise<void>}
 */
export async function carregarSala(req, res) {
  try {
    //req.params.codigo - código identificador da sala
    const codigoSala = req.params.codigo.toUpperCase();

    console.log("carregarSala params:", req.params.codigo);

    //req.user - utilizador autenticado
    if (!req.user) {
      return res.status(401).send("É necessário iniciar sessão.");
    }

    const sala = await entrarNaSala(codigoSala, req.user);

    if (!sala) {
      return res.status(404).send("Sala não encontrada ou código inválido.");
    }

    res.render("salaPrivada", {
      sala,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || "Erro no servidor ao carregar a sala.");
  }
}

/**
 * permite a entrada de um utilizador numa sala multiplayer existente.
 * @param {Object} req Pedido HTTP contendo o código da sala.
 * @param {Object} res Resposta HTTP enviada ao cliente.
 * @returns {Promise<void>}
 */
export async function entrarSala(req, res) {
    
    try {
        const codigo = req.params.codigo; //código da sala
        const sala = await entrarNaSala(
            codigo,
            req.user //utilizador autenticado
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

/**
 * remove um utilizador de uma sala multiplayer.
 * @param {Object} req pedido HTTP contendo o código da sala.
 * @param {Object} res resposta HTTP enviada ao cliente.
 * @returns {Promise<void>}
 */
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