'use strict';

document.addEventListener("DOMContentLoaded", () => {

    const timer = localStorage.getItem("timer");
    const finalizarBtn = document.getElementById("finalizar-jogo");
    const display = document.getElementById("timer-display");
    const challengeType = localStorage.getItem("challengeType");
    const challengeValue = localStorage.getItem("challengeValue");

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
        if (event.key === "Enter") {
        let palavra = input.value;

    if (validarPalavra(palavra)) {
        adicionarPalavra(palavra);
        adicionarPontos(20);
        palavrasValidas++;
    } else {
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
                return;
            }
        }
        /*window.location.href = "fimDeJogo.html";*/
        window.location.href = "/fimJogo";
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

});

