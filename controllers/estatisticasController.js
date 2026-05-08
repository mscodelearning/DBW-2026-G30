import User from "../models/userModel.js";

export async function atualizarEstatisticas(req, res) {

    try {

        const userId = req.user._id;

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