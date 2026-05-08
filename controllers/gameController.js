import {
    getRandomPalavraMestra,
    gerarPalavrasValidas
} from "../services/gameService.js";

import normalizarPalavra from "../utils/normalizarPalavras.js";


//let currentGame = null;

function iniciarJogoSp(req, res) {

    const palavraMestra = getRandomPalavraMestra();

    const palavrasValidas = gerarPalavrasValidas(palavraMestra);

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

function submeterResposta(req, res) {
    const currentGame = req.session.currentGame;
    const palavra = normalizarPalavra(req.body.palavra.toLowerCase());

    // ja descobertas
    if (currentGame.palavrasDescobertas.includes(palavra)) {

        return res.json({
            success: false,
            message: "Palavra já descoberta"
        });
    }

    // palavra valida
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

    // invalida
    return res.json({
        success: false,
        message: "Palavra inválida"
    });
}

export {
    iniciarJogoSp,
    submeterResposta
};