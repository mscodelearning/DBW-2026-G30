'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const customInput = document.getElementById("custom-timer");
    const timerOptions = document.querySelectorAll("#timer-options .item");
    const challengeOptions = document.querySelectorAll("#challenge-options .item");
    const startButton = document.getElementById("start-game");
    const customNum = document.getElementById("custom-num");
    const customMin = document.getElementById("custom-min");
    const customMax = document.getElementById("custom-max");
    const accessOptions = document.querySelectorAll("#access-options .item");
    const numPlayers = document.querySelectorAll("#num-players .item");


    let selectedTimer = null;
    let challengeType = null;
    let challengeValue = null;
    let selectedAccess= null;
    let selectedPlayers = null;

    function updateButton() {
        let timerValid = selectedTimer !== null;

        let challengeValid =
            challengeType === "Não" ||
            (challengeType && challengeValue !== null);
        
        let accessValid = selectedAccess !== null;
        let playersValid = selectedPlayers !== null;

        startButton.disabled = !(timerValid && challengeValid && accessValid && playersValid);

    }

    function selectOne(group, clicked, type) {
        group.forEach(item => item.classList.remove("selected"));
        clicked.classList.add("selected");

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

        if (type === "challenge") {
            const value = clicked.textContent.trim();

            challengeType = value;
            challengeValue = null;

            customNum.style.display = "none";
            customMin.style.display = "none";
            customMax.style.display = "none";

            if (value === "Objetivo: nº de palavras") {
                customNum.style.display = "block";
            }

            if (value === "Mín. letras") {
                customMin.style.display = "block";
            }

            if (value === "Máx. letras") {
                customMax.style.display = "block";
            }
        }

        if (type === "access") {
            const value = clicked.textContent.trim();
            selectedAccess = value;
        }

        if (type === "players") {
            const value = clicked.textContent.trim();
            selectedPlayers = parseInt(value);
        }

        }

        updateButton();

        customNum.addEventListener("input", () => {
            challengeValue = customNum.value || null;
            updateButton();
        });

        customMin.addEventListener("input", () => {
            challengeValue = customMin.value || null;
            updateButton();
        });

        customMax.addEventListener("input", () => {
            challengeValue = customMax.value || null;
            updateButton();
        });

        timerOptions.forEach(item => {
            item.addEventListener("click", () => selectOne(timerOptions, item, "timer"));
        });

        challengeOptions.forEach(item => {
            item.addEventListener("click", () => selectOne(challengeOptions, item, "challenge"));
        });
        
        accessOptions.forEach(item => {
            item.addEventListener("click", () => selectOne(accessOptions, item, "access"));
        });

        numPlayers.forEach(item => {
            item.addEventListener("click", () => selectOne(numPlayers, item, "players"));
        });

        customInput.addEventListener("input", () => {
            selectedTimer = customInput.value ? parseInt(customInput.value) : null;
            updateButton();
        });


    startButton.addEventListener("click", () => {
        if (!startButton.disabled) {
            localStorage.setItem("timer", selectedTimer);
            localStorage.setItem("challengeType", challengeType);
            localStorage.setItem("challengeValue", challengeValue);
            localStorage.setItem("access", selectedAccess);
            localStorage.setItem("players", selectedPlayers);
            window.location.href = "/salasPrivadas";
        }
    });
});

