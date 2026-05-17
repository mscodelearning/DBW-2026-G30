'use strict';

document.addEventListener("DOMContentLoaded", () => {
    // inicializa a liagacao socket.io no cliente
    window.socket = io();

    const codigoSala = window.dadosSala.codigo;
    const userId = window.dadosSala.userId;

    // informa o servidor de que o utilizador entrou na sala multiplayer
    socket.emit("joinMultiplayerRoom", {
        codigoSala,
        userId
    });

    // atualiza a lista de jogadores mostrada na interface
    socket.on("playersUpdated", (jogadores) => {

        const listaJogadores = document.querySelector(".lista-jogadores");

        listaJogadores.innerHTML = "";

        jogadores.forEach(jogador => {

            listaJogadores.innerHTML += `

                <div class="jogador">

                    <img class="fundo-utilizador"
                        src="/images/fundo-icon-user.png"
                        alt="">

                    <img class="icon-square-utilizador"
                        src="${jogador.avatar || '/symbols/Union-user-icon.png'}"
                        alt="avatar">

                    <span class="nome-jogador">
                        ${jogador.nickname}
                    </span>

                </div>

            `;

        });

        // atualiza o contador de jogadores na sala
        const contador = document.getElementById("contadorJogadores");
        const maxPlayers = contador.dataset.max;

        contador.textContent =
            `${jogadores.length}/${maxPlayers}`;

    });


    const startButton = document.getElementById("start-button");

    if (startButton) {
        // permite ao user iniciar o jogo
        startButton.addEventListener("click", () => {

            socket.emit("startGame", {
                codigoSala,
                userId
            });

        });

    }

    // guarda os dados do jogo e redireciona para a pagina de jogo
    socket.on("gameStarted", (dadosJogo) => {

        localStorage.setItem(
            "multiplayerGameData",
            JSON.stringify(dadosJogo)
        );

        window.location.href = "/paginaJogoMultiplayer";

    });

    // mostra mensagens de erro enviadas pelo servidor
    socket.on("erroSala", ({ mensagem }) => {
        alert(mensagem);
    });

});