import Sala from '../models/sala.js';
import { refreshRoomExpiry, novaDataExpiracao } from "../services/roomExpiryService.js";


/**
 * atualiza o nome de uma sala multiplayer através do código da sala.
 * também redefine quando a sala deve expirar caso esta não seja uma sala default.
 * @param {Object} req pedido http contendo os dados da sala
 * @param {Object} res resposta http enviada ao cliente
 * @returns {Promise<void>}
 */
export async function updateNomeSala(req, res) {
  try {
    //req.params - parâmetros da rota
    //req.body - dados enviados pelo frontend
    const { codigo } = req.params;  //código identificador da sala
    const { nome } = req.body;      // novo nome da sala

    const nomeLimpo = nome?.trim();

    if (!nomeLimpo) {
      return res.status(400).json({ message: 'Nome inválido.' });
    }

    const sala = await Sala.findOne({ codigo });

    if (!sala) {
      return res.status(404).json({ message: 'Sala não encontrada.' });
    }

    sala.nome = nomeLimpo;

    if (!sala.isDefault) {
      sala.expireAt = novaDataExpiracao(20);
    } else {
      sala.expireAt = null;
    }
    await sala.save();
    
    // retorna a sala atualizada ou uma mensagem de erro.
    return res.json({
      message: 'Nome da sala atualizado com sucesso.',
      sala
    });

  } catch (err) {
    console.error('Erro ao atualizar nome da sala:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

