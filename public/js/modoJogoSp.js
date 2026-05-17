'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const customInput = document.getElementById("custom-timer");
    const timerOptions = document.querySelectorAll("#timer-options .item");
    const challengeOptions = document.querySelectorAll("#challenge-options .item");
    const startButton = document.getElementById("start-game");
    const customNum = document.getElementById("custom-num");
    const customMin = document.getElementById("custom-min");
    const customMax = document.getElementById("custom-max");


    let selectedTimer = null;
    let challengeType = null;
    let challengeValue = null;

    // ativa e desativa o boatao inicio conforme as opcoes escolhidas
    function updateButton() {
        let timerValid = selectedTimer !== null;

        let challengeValid =
            challengeType === "Não" ||
            (challengeType && challengeValue !== null);

        startButton.disabled = !(timerValid && challengeValid);
    }

    // garante que apenas uma opcao fica selecionada em cada grupo
    function selectOne(group, clicked, type) {
        group.forEach(item => item.classList.remove("selected"));
        clicked.classList.add("selected");

        // trata a selecao do temporizador
        if (type === "timer") {
        const value = clicked.textContent.trim();

        if (value === "Personalizado") {
            customInput.style.display = "block";
            selectedTimer = null;
        } else {
            customInput.style.display = "none";

            if (value === "Não") {
            selectedTimer = "none";
            } else {
            selectedTimer = parseInt(value);
            }
        }
        }

        // trata da selecao do tipo de desafio
        if (type === "challenge") {
            const value = clicked.textContent.trim();

            challengeType = value;
            challengeValue = null;

            customNum.style.display = "none";
            customMin.style.display = "none";
            customMax.style.display = "none";

            if (value === "Objetivo: nº palavras") {
                customNum.style.display = "block";
            }

            if (value === "Mín. letras") {
                customMin.style.display = "block";
            }

            if (value === "Máx. letras") {
                customMax.style.display = "block";
            }
        }

        updateButton();
    }

        // atualiza o valor do desafio qaundo o utilizador escreve um objetivo personalizado
        if (customNum) {
            customNum.addEventListener("input", () => {
                challengeValue = customNum.value || null;
                updateButton();
            });
        }

        // atualiza o valor minimop de letras do desafio
        if (customMin) {
            customMin.addEventListener("input", () => {
                challengeValue = customMin.value || null;
                updateButton();
            });
        }

        // atualiza o valor maximo de letra do desafio
        if (customMax) {
            customMax.addEventListener("input", () => {
                challengeValue = customMax.value || null;
                updateButton();
            });
        }
              
    // permite selecionar uma opcao de temporizador
    timerOptions.forEach(item => {
        item.addEventListener("click", () => selectOne(timerOptions, item, "timer"));
    });

    //permite selecionar uma opcao de desafio
    challengeOptions.forEach(item => {
        item.addEventListener("click", () => selectOne(challengeOptions, item, "challenge"));
    });

    // atualiza o temporizador quando é escolhido um valor personalizado
    customInput.addEventListener("input", () => {
        selectedTimer = customInput.value ? parseInt(customInput.value) : null;
        updateButton();
    });

    // guarda as opcoes escolhidas e inica o jogo
    startButton.addEventListener("click", () => {
        if (!startButton.disabled) {
            localStorage.setItem("timer", selectedTimer);
            localStorage.setItem("challengeType", challengeType);
            localStorage.setItem("challengeValue", challengeValue);
            window.location.href = "/jogoSingleplayer";
        }
    });
});