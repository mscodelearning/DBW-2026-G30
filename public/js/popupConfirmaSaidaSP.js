'use strict'

const btnSair = document.getElementById('btnSair');
    const popupSair = document.getElementById('popupSair');
    const confirmarSair = document.getElementById('confirmarSair');
    const cancelarSair = document.getElementById('cancelarSair');

    btnSair.addEventListener('click', function (event) {
        event.preventDefault();
        popupSair.classList.remove('hidden');
    });

    cancelarSair.addEventListener('click', function () {
        popupSair.classList.add('hidden');
    });

    confirmarSair.addEventListener("click", async () => {

        try {

            const pathParts =
                window.location.pathname.split("/");

            const codigoSala =
                pathParts[pathParts.length - 1];

            const resposta = await fetch(
                `/multiplayer/sala/${codigoSala}/sair`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const dados = await resposta.json();

            if (dados.sucesso) {
                /*novo para sair da sala*/
                socket.emit("leaveRoom", codigoSala);
                window.location.href =
                    "/selectMultiplayerPage";

            } else {

                alert(dados.erro);

            }

        } catch (err) {

            console.error(err);

            alert("Erro ao sair da sala");

        }

    });

    


popupSair.addEventListener('click', function(e) {
        if (e.target === popupSair) {
            popupSair.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            popupSair.classList.add('hidden');
        }
    });
