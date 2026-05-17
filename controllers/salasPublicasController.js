import Sala from "../models/sala.js";

/**
 * carrega todas as salas públicas disponíveis e envia os dados para renderização da página de salas públicas
 * @param {Object} req pedido http recebido pelo servidor
 * @param {Object} res resposta http utilizada para renderizar a página
 * @returns {Promise<void>}
 */
export async function carregarSalasPublicas(req, res) {
  try {
    const salasDB = await Sala.find({ "configuracoes.access": "Público" }).lean();

    const salasPublicas = salasDB.map((sala) => ({
      ...sala,
      jogadoresAtuais: Array.isArray(sala.jogadores) ? sala.jogadores.length : 0,
      isDefault: !!sala.isDefault
    }));
    
    //renderiza a página com a lista de salas públicas.
    res.render("salasPublicas", { salasPublicas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar salas públicas.");
  }
}

