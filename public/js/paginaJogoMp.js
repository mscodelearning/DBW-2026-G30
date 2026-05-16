'use strict';

document.addEventListener("DOMContentLoaded", () => {

    const dadosJogo = JSON.parse(
        localStorage.getItem("multiplayerGameData")
    );

    document.getElementById("palavra-mestra").textContent = dadosJogo.palavraMestra;

    const timer = dadosJogo.configuracoes.timer;
    const challengeType = dadosJogo.configuracoes.challengeType;
    const challengeValue = dadosJogo.configuracoes.challengeValue;
    const players = dadosJogo.jogadores;
    const finalizarBtn = document.getElementById("finalizar-jogo");
    const display = document.getElementById("timer-display");
    const access = localStorage.getItem("access");
    let tempoInicial = Date.now();
    let erros = 0;

    let palavrasValidas = 0;
    let palavrasDescobertas = 0;

    if (!timer || timer === 0) {
        finalizarBtn.style.display = "block";
        display.style.display = "none";
    } else {
        finalizarBtn.style.display = "none";
        display.style.display = "block";
        iniciarTimer(parseInt(timer));
    }

    let nome = "Pessoa";
    let pontos = 0;

    const socket = io();
    socket.emit("joinMultiplayerRoom", {
        codigoSala: dadosJogo.codigoSala,
        userId: currentUserId
    });

    socket.on("gameFinished", (resultados) => {
        localStorage.setItem("gameResults",JSON.stringify(resultados));
        localStorage.setItem("fimJogoCodigoSala", dadosJogo.codigoSala);
        window.location.href = "/fimJogoMp";
    });

    socket.on("wordResult", (data) => {
        console.log("WORD RESULT RECEIVED");
        console.log("player:", currentUserId);
        console.log("word:", data.palavra);
        console.log("totalDescobertas:", data.totalDescobertas);

        if (data.success) {

            adicionarPalavra(data.palavra);

            pontos += data.pontos;
            

            document.getElementById("pontuacao").textContent = pontos;

            palavrasDescobertas = data.totalDescobertas;
            console.log("palavrasDescobertas FRONTEND:", palavrasDescobertas);


            console.log("SENDING updateWords");
            console.log({
                palavras: palavrasDescobertas,
                player: currentUserId
            });

        } else {

            erros++;

            socket.emit("updateErrors", {
                codigoSala: dadosJogo.codigoSala,
                userId: currentUserId,
                erros
            });

            mostrarAlerta(data.message);
        }
    });

    socket.on("scoreUpdated", ({ userId, pontos }) => {

        if (userId === currentUserId) {
            return;
        }

        const playerDiv =
            document.querySelector(
                `[data-player-id="${userId}"]`
            );

        if (!playerDiv) {
            return;
        }

        const spans = playerDiv.querySelectorAll("span");

        spans[1].textContent = `${pontos} pts`;
    });


    document.getElementById("nome-jogador").textContent = nome;
    document.getElementById("pontuacao").textContent = pontos;

    const input = document.getElementById("caixa-texto");

    input.addEventListener("keydown", async (event) => {

        if (event.key !== "Enter") return;

        const palavra = input.value.trim();

        if (!palavra) return;

        if (!validarPalavra(palavra)) {

            erros++;

            socket.emit("updateErrors", {
                codigoSala: dadosJogo.codigoSala,
                userId: currentUserId,
                erros
            });

            mostrarAlerta("Palavra inválida para este desafio!");

            input.value = "";

            return;
        }

        socket.emit("submitWord", {
            codigoSala: dadosJogo.codigoSala,
            userId: currentUserId,
            palavra
        });

        input.value = "";
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
        lista.scrollTop = lista.scrollHeight;
    }

    function iniciarTimer(tempo) {

        let tempoRestante = tempo;

        const display = document.getElementById("timer-display");

        display.textContent = tempoRestante + "s";

        const intervalo = setInterval(() => {

            tempoRestante--;

            display.textContent = tempoRestante + "s";

            if (tempoRestante <= 0) {
                clearInterval(intervalo);
                display.textContent = "0s";
                terminarJogo();
            }

        }, 1000);
    }


async function terminarJogo() {
    if (challengeType === "Objetivo: nº palavras") {
        if (palavrasDescobertas < parseInt(challengeValue)) {
            mostrarAlerta("Ainda não atingiu o número de palavras necessário!");
        }

        let tempoFinal = Date.now();
        let tempoJogado = Math.floor((tempoFinal - tempoInicial) / 1000);

        const estatisticasJogo = {
            tempoJogado: tempoJogado,
            palavrasDescobertas: palavrasDescobertas,
            pontos: pontos,
            erros: erros,
            username: localStorage.getItem("username") || "Jogador",
            nickname: localStorage.getItem("nickname") || localStorage.getItem("username") || "Jogador",
            avatar: localStorage.getItem("avatar") || "/images/icone-pessoa.png"
        };

        console.log("username LS:", localStorage.getItem("username"));
        console.log("nickname LS:", localStorage.getItem("nickname"));
        console.log("avatar LS:", localStorage.getItem("avatar"));
        console.log("estatisticasJogo:", estatisticasJogo);

        localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticasJogo));
        localStorage.setItem("fimJogoCodigoSala", dadosJogo.codigoSala);

        socket.emit("finishGame", {
            codigoSala: dadosJogo.codigoSala,
            userId: currentUserId,
            tempo: tempoJogado
        });

        setTimeout(() => {
            window.location.href = "/fimJogoMp";
        }, 2000);  
    }

    let tempoFinal = Date.now();
    let tempoJogado = Math.floor((tempoFinal - tempoInicial) / 1000);

    const estatisticasJogo = {
        tempoJogado: tempoJogado,
        palavrasDescobertas: palavrasDescobertas,
        pontos: pontos,
        erros: erros,
        username: localStorage.getItem("username") || "Jogador",
        nickname: localStorage.getItem("nickname") || localStorage.getItem("username") || "Jogador",
        avatar: localStorage.getItem("avatar") || "/images/icone-pessoa.png"
    };

    localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticasJogo));
    localStorage.setItem("ultimoCodigoSala", dadosJogo.codigoSala);
    localStorage.setItem("ultimoTipoSala", dadosJogo.configuracoes.access);
    localStorage.setItem("fimJogoCodigoSala", dadosJogo.codigoSala);

    await fetch("/api/estatisticas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(estatisticasJogo)
    });

    socket.emit("endGame", {
        codigoSala: dadosJogo.codigoSala
    });

    setTimeout(() => {
        window.location.href = "/fimJogoMp";
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

    const myId = currentUserId;

    console.log("players data:", players);
    console.log("myId:", myId);
    console.log("found player:", players.find(p => p.id == myId));

     renderPlayers(players, myId);
});


function renderPlayers(players, myId) {
    const container = document.getElementById("adversarios-container");
    container.innerHTML = "";

    const eu = players.find(p => p.id == myId);
    const adversarios = players.filter(
        p => p.id.toString() !== myId.toString()
    );
    
    document.getElementById("nome-jogador").textContent = eu.nickname;
    document.getElementById("pontuacao").textContent = 0;

    adversarios.forEach(player => {
        const div = document.createElement("div");
        div.classList.add("adversario");
        div.setAttribute("data-player-id", player.id);

        div.innerHTML = `
            <div class="mensagem-box"></div>
            <div class="player-info">
                <img src="/Images/icone-pessoa.png">
                <span>${player.nickname}</span>
                <span>0 pts</span>
            </div>
        `;

        container.appendChild(div);
    });

}