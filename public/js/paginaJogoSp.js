document.addEventListener("DOMContentLoaded", () => {

    const timer = localStorage.getItem("timer");
    const finalizarBtn = document.getElementById("finalizar-jogo");
    const display = document.getElementById("timer-display");

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

        adicionarPalavra(palavra);
        adicionarPontos(20);

        input.value = "";
        }
    });

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
        window.location.href = "fimDeJogo.html";
    }

finalizarBtn.addEventListener("click", terminarJogo);

});

