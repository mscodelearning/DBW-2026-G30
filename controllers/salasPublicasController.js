import Sala from "../models/sala.js";

export async function carregarSalasPublicas(req, res) {
  try {
    const salasDB = await Sala.find({ "configuracoes.access": "Público" }).lean();

    const salasPublicas = salasDB.map((sala) => ({
      ...sala,
      jogadoresAtuais: Array.isArray(sala.jogadores) ? sala.jogadores.length : 0,
      isDefault: !!sala.isDefault
    }));

    res.render("salasPublicas", { salasPublicas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar salas públicas.");
  }
}

