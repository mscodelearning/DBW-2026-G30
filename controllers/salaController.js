import Sala from '../models/sala.js';
import { refreshRoomExpiry, novaDataExpiracao } from "../services/roomExpiryService.js";



export async function updateNomeSala(req, res) {
  try {
    const { codigo } = req.params;
    const { nome } = req.body;

    const nomeLimpo = nome?.trim();

    if (!nomeLimpo) {
      return res.status(400).json({ message: 'Nome inválido.' });
    }

    const sala = await Sala.findOne({ codigo });

    if (!sala) {
      return res.status(404).json({ message: 'Sala não encontrada.' });
    }

    sala.nome = nomeLimpo;
    //sala.expireAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    //sala.expireAt = new Date(Date.now() + 1 * 60 * 1000);
    //sala.expireAt = novaDataExpiracao(10);
//////////////////////////////
    if (!sala.isDefault) {
      sala.expireAt = novaDataExpiracao(10);
    } else {
      sala.expireAt = null;
    }
/////////////////////////////
    await sala.save();


    return res.json({
      message: 'Nome da sala atualizado com sucesso.',
      sala
    });
  } catch (err) {
    console.error('Erro ao atualizar nome da sala:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

