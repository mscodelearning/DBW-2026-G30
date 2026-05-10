'use strict';

const entrarLink = document.getElementById("entrar-link");
const inputCodigo = document.getElementById("codigoSala");

entrarLink.addEventListener("click", async function (event) {

    event.preventDefault();

    const codigo = inputCodigo.value
        .trim()
        .toUpperCase();

    if (!codigo) {
        alert("Introduz um código de sala.");
        return;
    }

    try {

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