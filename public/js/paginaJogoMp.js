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
    //const timer = localStorage.getItem("timer");
    const finalizarBtn = document.getElementById("finalizar-jogo");
    const display = document.getElementById("timer-display");
    //const challengeType = localStorage.getItem("challengeType");
    //const challengeValue = localStorage.getItem("challengeValue");
    //const players = JSON.parse(localStorage.getItem("players")) || [];
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

//novo
    const socket = io();
    socket.emit("joinMultiplayerRoom", {
        codigoSala: dadosJogo.codigoSala,
        userId: currentUserId
    });

//novo
    socket.on("wordResult", (data) => {

        if (data.success) {

            adicionarPalavra(data.palavra);

            pontos += data.pontos;
            

            document.getElementById("pontuacao").textContent = pontos;

            palavrasDescobertas = data.totalDescobertas;

            socket.emit("updateWords", {
                codigoSala: dadosJogo.codigoSala,
                userId: currentUserId,
                palavras: palavrasDescobertas
            });

            socket.emit("updateScore", {
                codigoSala: dadosJogo.codigoSala,
                userId: currentUserId,
                pontos
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


    /*INPUT ANTIGO
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
    });*/
//NOVO
    const input = document.getElementById("caixa-texto");

    input.addEventListener("keydown", async (event) => {

        if (event.key !== "Enter") return;

        const palavra = input.value.trim();

        if (!palavra) return;

        // validar desafios
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
//NOVO



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

    /*function adicionarPontos(valor) {
        pontos += valor;
        document.getElementById("pontuacao").textContent = pontos;
        socket.emit("updateScore", {
            codigoSala: dadosJogo.codigoSala,
            userId: currentUserId,
            pontos
        });
    }*/

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


/*ANTIGA
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
            window.location.href = "/fimJogoMp";
        }, 2000);  
    }*/
   //NOVA
      /* async function terminarJogo() {
        if (challengeType === "Objetivo: nº de palavras") {
            if (palavrasDescobertas < parseInt(challengeValue)) {
                mostrarAlerta("Ainda não atingiu o número de palavras necessário!");
            }
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

        loadingOverlay.classList.remove("d-none");
        finalizarBtn.disabled = true;

        try {
            /*const response = await fetch("/api/estatisticas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(estatisticasJogo)
            });

            if (!response.ok) {
                throw new Error("Erro ao guardar estatísticas");
            }

            await new Promise(resolve => setTimeout(resolve, 2000));*/
/*
            window.location.href = "/fimJogoSp";
        } catch (err) {
            console.error(err);
            mostrarAlerta("Erro ao carregar estatísticas.");
        } finally {
            loadingOverlay.classList.add("d-none");
            finalizarBtn.disabled = false;
        }
    }*/
//NOVA

async function terminarJogo() {
    if (challengeType === "Objetivo: nº de palavras") {
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

        /*await fetch("/api/estatisticas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estatisticasJogo)
        });*/
        
        socket.emit("finishGame", {
            codigoSala: dadosJogo.codigoSala,
            userId: currentUserId,
            tempo: tempoJogado
        });

        socket.on("gameFinished", (resultados) => {
            localStorage.setItem("gameResults",JSON.stringify(resultados));
            window.location.href = "/fimJogoMp";
        });

        //atualizarEstatisticasGlobais(estatisticasJogo);

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

    /* dados para testar multiplayer
    const fakePlayers = [
        { id: "1", name: "Maria", score: 0 },
        { id: "2", name: "João", score: 0 },
        { id: "3", name: "Mário", score: 0 },
        { id: "4", name: "Joana", score: 0 }
    ];*/
// simular "eu"
    //const myId = "1";
    const myId = currentUserId;


    //debug
    console.log("players data:", players);
    console.log("myId:", myId);
    console.log("found player:", players.find(p => p.id == myId));


    // testar diferentes numeros de jogadores
    //renderPlayers(fakePlayers.slice(0, 2), myId); // 2 players
     //renderPlayers(fakePlayers.slice(0, 3), myId); // 3 players
     renderPlayers(players, myId); // 4 players
});


/*estatísticas globais de jogo para colocar no perfil*/
/*ANTIGO
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
}*/

function renderPlayers(players, myId) {
    const container = document.getElementById("adversarios-container");
    container.innerHTML = "";

    const eu = players.find(p => p.id == myId);
    const adversarios = players.filter(
        p => p.id.toString() !== myId.toString()
    );
    // eu (esquerda)
    document.getElementById("nome-jogador").textContent = eu.nickname;
    document.getElementById("pontuacao").textContent = 0;

    // adversarios (direita)
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