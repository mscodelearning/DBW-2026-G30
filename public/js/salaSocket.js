'use strict';

document.addEventListener("DOMContentLoaded", () => {

    window.socket = io();

    const codigoSala = window.dadosSala.codigo;
    const userId = window.dadosSala.userId;

    socket.emit("joinMultiplayerRoom", {
        codigoSala,
        userId
    });

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


        const contador =
            document.getElementById("contadorJogadores");

        const maxPlayers =
            contador.dataset.max;

        contador.textContent =
            `${jogadores.length}/${maxPlayers}`;

    });


    const startButton = document.getElementById("start-button");

    if (startButton) {

        startButton.addEventListener("click", () => {

            socket.emit("startGame", {
                codigoSala,
                userId
            });

        });

    }

    socket.on("gameStarted", (dadosJogo) => {

        localStorage.setItem(
            "multiplayerGameData",
            JSON.stringify(dadosJogo)
        );

        window.location.href = "/paginaJogoMultiplayer";

    });

    socket.on("erroSala", ({ mensagem }) => {
        alert(mensagem);
    });

});