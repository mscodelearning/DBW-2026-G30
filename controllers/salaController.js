import Sala from '../models/sala.js';

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