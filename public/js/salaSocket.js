'use strict';

window.socket = io();

const pathParts = window.location.pathname.split("/");

const codigoSala = pathParts[pathParts.length - 1];

//socket.emit("joinRoom", codigoSala);
socket.emit("joinMultiplayerRoom", {

    codigoSala: window.dadosSala.codigo,

    userId: window.dadosSala.userId

});

socket.on("playersUpdated", (jogadores) => {

    const listaJogadores =
        document.querySelector(".lista-jogadores");

    listaJogadores.innerHTML = "";

    jogadores.forEach(jogador => {

        listaJogadores.innerHTML += `

            <div class="jogador">

                <img class="fundo-utilizador"
                    src="/images/fundo-icon-user.png"
                    alt="">

                <img class="icon-square-utilizador"
                    src="/symbols/icon-user-square.png"
                    alt="">

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
