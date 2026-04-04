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

    function updateButton() {
        let timerValid = selectedTimer !== null;

        let challengeValid =
            challengeType === "Não" ||
            (challengeType && challengeValue !== null);

        startButton.disabled = !(timerValid && challengeValid);
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

            // hide all inputs
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

        updateButton();
    }

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

    customInput.addEventListener("input", () => {
        selectedTimer = customInput.value ? parseInt(customInput.value) : null;
        updateButton();
    });

    startButton.addEventListener("click", () => {
        if (!startButton.disabled) {
            localStorage.setItem("timer", selectedTimer);
            localStorage.setItem("challengeType", challengeType);
            localStorage.setItem("challengeValue", challengeValue);
            window.location.href = "jogoSingleplayer.html";
        }
    });
});