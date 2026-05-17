import {
    getRandomPalavraMestra,
    gerarPalavrasValidas
} from "../services/gameService.js";

import normalizarPalavra from "../utils/normalizarPalavras.js";

/**
 * inicia um novo jogo singleplayer, gerando uma palavra mestra aleatória e as palavras válidas associadas.
 * guarda também os dados do jogo na sessão do utilizador.
 * @param {Object} req pedido http com acesso à sessão do utilizador
 * @param {Object} res resposta http utilizada para renderizar a página do jogo.
 * @returns {void}
 */
function iniciarJogoSp(req, res) {

    const palavraMestra = getRandomPalavraMestra();

    const palavrasValidas = gerarPalavrasValidas(palavraMestra);
    
    //req.session - sessão atual do utilizador
    req.session.currentGame = {
        palavraMestra,
        palavrasValidas,
        palavrasDescobertas: [],
        pontos: 0
    };

    res.render("jogoSingleplayer", {
        palavraMestra
    });
    console.log(req.session.currentGame.palavrasValidas);
}

/**
 * valida e processa uma resposta submetida pelo jogador no modo singleplayer.
 * verifica se a palavra já foi descoberta e se é válida, atualizando os pontos e o progresso do jogo.
 * @param {Object} req pedido HTTP contendo a palavra enviada pelo jogador.
 * @param {Object} res resposta HTTP enviada ao cliente.
 * @returns {Object} retorna um JSON indicando sucesso ou erro da submissão.
 */
function submeterResposta(req, res) {
    const currentGame = req.session.currentGame;
    const palavra = normalizarPalavra(req.body.palavra.toLowerCase());

    //palavra já descoberta
    if (currentGame.palavrasDescobertas.includes(palavra)) {

        return res.json({
            success: false,
            message: "Palavra já descoberta"
        });
    }

    //palavra válida
    if (currentGame.palavrasValidas.includes(palavra)) {

        currentGame.palavrasDescobertas.push(palavra);

        currentGame.pontos += palavra.length;

        return res.json({
            success: true,
            pontos: currentGame.pontos,
            totalDescobertas: currentGame.palavrasDescobertas.length,
            palavra
        });
    }

    return res.json({
        success: false,
        message: "Palavra inválida"
    });
}

export {
    iniciarJogoSp,
    submeterResposta
};