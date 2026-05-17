'use strict';

const entrarLink = document.getElementById("entrar-link");
const inputCodigo = document.getElementById("codigoSala");

// trata a tentativa de entrada numa sala privada atraves do codigo inserido
entrarLink.addEventListener("click", async function (event) {

    event.preventDefault();

    // obtem e normaliza o codigo da sala introduzido pelo utilizador
    const codigo = inputCodigo.value
        .trim()
        .toUpperCase();

    if (!codigo) {
        alert("Introduz um código de sala.");
        return;
    }

    try {
        // envia um pedido ao servidor para entrar na sala indicada
        const resposta = await fetch(
            `/multiplayer/sala/${codigo}/entrar`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const dados = await resposta.json();

        if (dados.sucesso) {
            // redireciona o user para a pagina da sala
            window.location.href =
                `/multiplayer/sala/${codigo}`;

        } else {

            alert(dados.erro);

        }

    } catch (err) {

        console.error(err);
        alert("Erro ao entrar na sala.");

    }

});