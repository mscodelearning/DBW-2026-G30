import User from "../models/userModel.js";
/**
 * atualiza as estatísticas globais do utilizador
 * @param {Object} req pedido http contendo os dados das estatísticas no body
 * @param {Object} res resposta http enviada ao cliente
 * @returns {Promise<void>}
 * */
export async function atualizarEstatisticas(req, res) {

    try {
        //id do utilizador autenticado
        const userId = req.user._id;

        //dados enviados pelo frontend
        const {
            pontos,
            palavrasDescobertas,
            erros,
            tempoJogado
        } = req.body;

        await User.findByIdAndUpdate(userId, {

            $inc: {
                "estatisticas.totalPontos": pontos,
                "estatisticas.respostasEncontradas": palavrasDescobertas,
                "estatisticas.respostasErradas": erros,
                "estatisticas.tempoTotal": tempoJogado,
            }
        });

        res.json({ success: true });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Erro ao atualizar estatísticas"
        });
    }
}

/**
 * obtém e devolve as estatísticas globais do perfil do utilizador
 * @param {Object} req pedido http contendo o utilizador autenticado
 * @param {Object} res resposta http enviada ao cliente
 * @returns {Promise<void>}
 */
export async function obterEstatisticasPerfil(req, res) {

    try {

        const user = await User.findById(req.user._id);

        res.json(user.estatisticas);

    } catch (error) {

        res.status(500).json({
            message: "Erro ao carregar estatísticas"
        });
    }
}