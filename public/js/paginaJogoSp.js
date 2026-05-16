'use strict';



document.addEventListener("DOMContentLoaded", () => {

    

    const timer = localStorage.getItem("timer");
    const finalizarBtn = document.getElementById("finalizar-jogo");

    const loadingOverlay = document.getElementById("loading-overlay");///////////////

    const display = document.getElementById("timer-display");
    const challengeType = localStorage.getItem("challengeType");
    const challengeValue = localStorage.getItem("challengeValue");
    let tempoInicial = Date.now();
    let pontos = 0;
    let erros = 0;
    let palavrasDescobertas = 0;
    
    if (timer === "none") {
        finalizarBtn.style.display = "block";
        display.style.display = "none";
    } else {
        finalizarBtn.style.display = "none";
        display.style.display = "block";
        iniciarTimer(parseInt(timer));
    }


   // document.getElementById("nome-jogador").textContent = "Pessoa";
    document.getElementById("pontuacao").textContent = pontos;


//novo
    const input = document.getElementById("caixa-texto");

    input.addEventListener("keydown", async (event) => {

        if (event.key !== "Enter") return;

            const palavra = input.value.trim();

            if (!palavra) return;

            // validar desafios (mín/max letras)
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
//novo

/*antigo input
    let input = document.getElementById("caixa-texto");

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && input.value !== "") {
        let palavra = input.value;

    if (validarPalavra(palavra)) {
        adicionarPalavra(palavra);
        adicionarPontos(20);
        palavrasDescobertas++;
    } else {
        erros++;
        mostrarAlerta("Palavra inválida para este desafio!");
    }
        input.value = "";
    }
    }); 
antigo input*/

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
        lista.scrollTop = lista.scrollHeight;
    }
    
/*
    function adicionarPontos(valor) {
        pontos += valor;
        document.getElementById("pontuacao").textContent = pontos;
    }*/

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


/*
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

        console.log("username LS:", localStorage.getItem("username"));
        console.log("nickname LS:", localStorage.getItem("nickname"));
        console.log("avatar LS:", localStorage.getItem("avatar"));
        console.log("estatisticasJogo:", estatisticasJogo);

        localStorage.setItem("estatisticasJogo", JSON.stringify(estatisticasJogo));

        await fetch("/api/estatisticas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estatisticasJogo)
        });

        //atualizarEstatisticasGlobais(estatisticasJogo);

        setTimeout(() => {
            window.location.href = "/fimJogoSp";
        }, 2000);  
    }*/

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


/*estatísticas globais de jogo para colocar no perfil

function atualizarEstatisticasGlobais(statsJogo) {

    let statsGlobais = JSON.parse(localStorage.getItem("estatisticasGlobais"));

    if (!statsGlobais) {
        statsGlobais = {
            tempoTotal: 0,
            pontosTotal: 0,
            palavrasTotal: 0,
            errosTotal: 0,
            jogosJogados: 0
        };
    }

    statsGlobais.tempoTotal += statsJogo.tempoJogado;
    statsGlobais.pontosTotal += statsJogo.pontos;
    statsGlobais.palavrasTotal += statsJogo.palavrasDescobertas;
    statsGlobais.errosTotal += statsJogo.erros;
    statsGlobais.jogosJogados += 1;

    localStorage.setItem("estatisticasGlobais", JSON.stringify(statsGlobais));
}*/

