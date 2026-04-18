'use strict';

document.addEventListener("DOMContentLoaded", () => {


    const timer = localStorage.getItem("timer");
    const finalizarBtn = document.getElementById("finalizar-jogo");
    const display = document.getElementById("timer-display");
    const challengeType = localStorage.getItem("challengeType");
    const challengeValue = localStorage.getItem("challengeValue");
    const players = JSON.parse(localStorage.getItem("players")) || [];
    const access = localStorage.getItem("access");
    let tempoInicial = Date.now();
    let erros = 0;

    let palavrasValidas = 0;

    if (timer === "none") {
        finalizarBtn.style.display = "block";
        display.style.display = "none";
    } else {
        finalizarBtn.style.display = "none";
        display.style.display = "block";
        iniciarTimer(parseInt(timer));
    }

    let nome = "Pessoa";
    let pontos = 0;

    document.getElementById("nome-jogador").textContent = nome;
    document.getElementById("pontuacao").textContent = pontos;

    let input = document.getElementById("caixa-texto");

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && input.value !== "") {
        let palavra = input.value;

    if (validarPalavra(palavra)) {
        adicionarPalavra(palavra);
        adicionarPontos(20);
        palavrasValidas++;
    } else {
        erros++;
        mostrarAlerta("Palavra inválida para este desafio!");
    }
        input.value = "";
    }
    });

    function validarPalavra(palavra) {
        if (challengeType === "Não") return true;

        const tamanho = palavra.length;

        if (challengeType === "Mín. letras") {
            return tamanho >= parseInt(challengeValue);
        }

        if (challengeType === "Máx. letras") {
            return tamanho <= parseInt(challengeValue);
        }

        return true;
    }

    function adicionarPalavra(palavra) {
        let lista = document.getElementById("palavras-descobertas");

        let p = document.createElement("p");
        p.textContent = palavra;

        lista.appendChild(p);
    }

    function adicionarPontos(valor) {
        pontos += valor;
        document.getElementById("pontuacao").textContent = pontos;
    }

        function iniciarTimer(tempo) {
            let tempoRestante = tempo;
            const display = document.getElementById("timer-display");

            display.textContent = tempoRestante + "s";

            let intervalo = setInterval(() => {
                tempoRestante--;

                display.textContent = tempoRestante + "s";

                if (tempoRestante <= 0) {
                    clearInterval(intervalo);
                    terminarJogo();
                }
            }, 1000);
        }

    function terminarJogo() {

        if (challengeType === "Objetivo: nº de palavras") {
            if (palavrasValidas < parseInt(challengeValue)) {
                mostrarAlerta("Ainda não atingiu o número de palavras necessário!");
            }
        }

        let tempoFinal = Date.now();
        let tempoJogado = Math.floor((tempoFinal - tempoInicial) / 1000);

        const estatisticasJogo = {
            tempoJogado: tempoJogado,
            palavrasValidas: palavrasValidas,
            pontos: pontos,
            erros: erros
        };

        localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticasJogo));

        atualizarEstatisticasGlobais(estatisticasJogo);

        setTimeout(() => {
            window.location.href = "/fimJogo";
        }, 2000);  
    }

    finalizarBtn.addEventListener("click", terminarJogo);

    function mostrarAlerta(mensagem) {
        const container = document.getElementById("alerta-container");

        container.innerHTML = `
            <div class="alert alert-success">
                ${mensagem}
            </div>
        `;

        setTimeout(() => {
            container.innerHTML = "";
        }, 2000);
    }

    // dados para testar multiplayer
    const fakePlayers = [
        { id: "1", name: "Maria", score: 0 },
        { id: "2", name: "João", score: 0 },
        { id: "3", name: "Mário", score: 0 },
        { id: "4", name: "Joana", score: 0 }
];

// simular "eu"
    const myId = "1";

    // testar diferentes numeros de jogadores
    //renderPlayers(fakePlayers.slice(0, 2), myId); // 2 players
     //renderPlayers(fakePlayers.slice(0, 3), myId); // 3 players
     renderPlayers(fakePlayers, myId); // 4 players
});


/*estatísticas globais de jogo para colocar no perfil*/

function atualizarEstatisticasGlobais(statsJogo) {

    let statsGlobais = JSON.parse(localStorage.getItem("estatisticasGlobais"));

    if (!statsGlobais) {
        statsGlobais = {
            tempoTotal: 0,
            pontosTotal: 0,
            palavrasTotal: 0,
            errosTotal: 0,
            jogosJogados: 0
        };
    }

    statsGlobais.tempoTotal += statsJogo.tempoJogado;
    statsGlobais.pontosTotal += statsJogo.pontos;
    statsGlobais.palavrasTotal += statsJogo.palavrasValidas;
    statsGlobais.errosTotal += statsJogo.erros;
    statsGlobais.jogosJogados += 1;

    localStorage.setItem("estatisticasGlobais", JSON.stringify(statsGlobais));
}

function renderPlayers(players, myId) {
    const container = document.getElementById("adversarios-container");
    container.innerHTML = "";

    const eu = players.find(p => p.id === myId);
    const adversarios = players.filter(p => p.id !== myId);

    // eu (esquerda)
    document.getElementById("nome-jogador").textContent = eu.name;
    document.getElementById("pontuacao").textContent = eu.score;

    // adversarios (direita)
    adversarios.forEach(player => {
        const div = document.createElement("div");
        div.classList.add("adversario");
        div.setAttribute("data-player-id", player.id);

        div.innerHTML = `
            <div class="mensagem-box"></div>
            <div class="player-info">
                <img src="/Images/icone-pessoa.png">
                <span>${player.name}</span>
                <span>${player.score} pts</span>
            </div>
        `;

        container.appendChild(div);
    });
}