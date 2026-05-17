'use strict'

const btnSair = document.getElementById('btnSair');
    const popupSair = document.getElementById('popupSair');
    const confirmarSair = document.getElementById('confirmarSair');
    const cancelarSair = document.getElementById('cancelarSair');

    // abre o popup de confirmacao de saida da sala
    btnSair.addEventListener('click', function (event) {
        event.preventDefault();
        popupSair.classList.remove('hidden');
    });

    // fecha o popup sem sair da sala
    cancelarSair.addEventListener('click', function () {
        popupSair.classList.add('hidden');
    });

    // confirma a saida da sala e redireciona o user
    confirmarSair.addEventListener("click", async () => {

        try {
            // obtem o codigo da sala a partir do url atual
            const pathParts = window.location.pathname.split("/");
            const codigoSala = pathParts[pathParts.length - 1];

            // envia o pedido ao servidor para sair da sala
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

    
// fecha o popup ao clicar fora da area de conteudo
popupSair.addEventListener('click', function(e) {
        if (e.target === popupSair) {
            popupSair.classList.add('hidden');
        }
    });

    // fecha o popup ao premir a tecla escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        popupSair.classList.add('hidden');
    }
});
