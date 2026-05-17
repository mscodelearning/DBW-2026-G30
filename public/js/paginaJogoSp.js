'use strict';



document.addEventListener("DOMContentLoaded", () => {

    // carrega as configuracoes e referencias inicais do jogo
    const timer = localStorage.getItem("timer");
    const finalizarBtn = document.getElementById("finalizar-jogo");

    const loadingOverlay = document.getElementById("loading-overlay");

    const display = document.getElementById("timer-display");
    const challengeType = localStorage.getItem("challengeType");
    const challengeValue = localStorage.getItem("challengeValue");
    let tempoInicial = Date.now();
    let pontos = 0;
    let erros = 0;
    let palavrasDescobertas = 0;
    
    // decide se o jogo termina manualmente ou com temporizador
    if (timer === "none") {
        finalizarBtn.style.display = "block";
        display.style.display = "none";
    } else {
        finalizarBtn.style.display = "none";
        display.style.display = "block";
        iniciarTimer(parseInt(timer));
    }

    document.getElementById("pontuacao").textContent = pontos;

    const input = document.getElementById("caixa-texto");

    // processa a palavra submetida pelo jogador ao premir enter
    input.addEventListener("keydown", async (event) => {

        if (event.key !== "Enter") return;

            const palavra = input.value.trim();

            if (!palavra) return;

            // valida a palavra de acordo com as regaras do desafio atual
            if (!validarPalavra(palavra)) {

                erros++;

                mostrarAlerta("Palavra inválida para este desafio!");

                input.value = "";

                return;
            }

            console.log("before fetch");

            const response = await fetch("/guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ palavra })
            
        });
        console.log("after json");
        const data = await response.json();

        if (data.success) {

            adicionarPalavra(data.palavra);
            pontos = data.pontos;
            document.getElementById("pontuacao").textContent = pontos;
            palavrasDescobertas = data.totalDescobertas;

        
        } else {

            erros++;
            mostrarAlerta(data.message);
        }
        console.log("before reset");
        input.value = "";

    });

    // valida a palavra com base no tipo  de desafio configurado
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

    // adiciona uma nova palavra valida a lista apresentada ao jogador
    function adicionarPalavra(palavra) {
        let lista = document.getElementById("palavras-descobertas");

        let p = document.createElement("p");
        p.textContent = palavra;

        lista.appendChild(p);
        lista.scrollTop = lista.scrollHeight;
    }

    // inicia a contagem descrescente do jogo
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

    // calcula as estatisticas finais e guarda os dados e termina o jogo
    async function terminarJogo() {
    if (challengeType === "Objetivo: nº palavras") {
        if (palavrasDescobertas < parseInt(challengeValue)) {
            mostrarAlerta("Ainda não atingiu o número de palavras necessário!");
        }
    }

    let tempoFinal = Date.now();
    let tempoJogado = Math.floor((tempoFinal - tempoInicial) / 1000);

    const estatisticasJogo = {
        tempoJogado: tempoJogado,
        palavrasDescobertas: palavrasDescobertas,
        pontos: pontos,
        erros: erros,
        username: localStorage.getItem("username") || "Jogador",
        nickname: localStorage.getItem("nickname") || localStorage.getItem("username") || "Jogador",
        avatar: localStorage.getItem("avatar") || "/images/icone-pessoa.png"
    };

    localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticasJogo));

    loadingOverlay.classList.remove("d-none");
    finalizarBtn.disabled = true;

    try {
        const response = await fetch("/api/estatisticas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estatisticasJogo)
        });

        if (!response.ok) {
            throw new Error("Erro ao guardar estatísticas");
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        window.location.href = "/fimJogoSp";
    } catch (err) {
        console.error(err);
        mostrarAlerta("Erro ao carregar estatísticas.");
    } finally {
        loadingOverlay.classList.add("d-none");
        finalizarBtn.disabled = false;
    }
}

    // permite terminar o jogo manualmente quando nao existe temporizador
    finalizarBtn.addEventListener("click", terminarJogo);

    // mostra mensagens temporarias ao jogador
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
