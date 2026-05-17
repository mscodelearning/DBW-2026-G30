'use strict';

document.addEventListener("DOMContentLoaded", () => {


    const botaoSair = document.getElementById("botao-sair-estatisticas");
    const codigoSala = localStorage.getItem("fimJogoCodigoSala") || multiplayerGameData?.codigoSala;

    // mostra informacao sobre o codigo da sala usado no fim do jogo
console.log("DEBUG fimJogoMp codigoSala:", {
    fimJogoCodigoSala: localStorage.getItem("fimJogoCodigoSala"),
    multiplayerGameDataCodigo: JSON.parse(localStorage.getItem("multiplayerGameData"))?.codigoSala,
    ultimoCodigoSala: localStorage.getItem("ultimoCodigoSala"),
    codigoUsado: codigoSala
});

// atualiza o botao de sair para regressar a sala correspondente
if (botaoSair && codigoSala) {
    botaoSair.href = `/multiplayer/sala/${codigoSala}`;
}

    // carrega os resultados finaais do jogo
    const gameResults = JSON.parse(localStorage.getItem("gameResults"));
    if (!gameResults) return;

    const playerCount = gameResults.length;
    const title = document.querySelector("h2");

    // ajusta o espacamento do titulo conforme o numero de jogadores
    if (playerCount === 3) {
        title.style.marginBottom = "40px";
    } 
    else if (playerCount === 4){
        title.style.marginBottom = "12px";
        title.style.marginTop = "-12px";
    }
    else if (playerCount === 2){
        title.style.marginBottom = "12px";
        title.style.marginTop = "-12px";
    }

    // determina o vencedor com base na pontuacao e em caso de empate no menor de erros
    const vencedor = gameResults.reduce((best, p) => {

        if (p.stats.pontos > best.stats.pontos) {
            return p;
        }

        if (p.stats.pontos === best.stats.pontos && p.stats.erros < best.stats.erros) {
            return p;
        }

        return best;
    });


    document.getElementById("vencedor").textContent = `Vencedor: ${vencedor.name}`;

    // escolhe o tipo de apresentacao dos resultados
    if (gameResults.length === 2) {
        render1v1(gameResults);
    } else {
        renderTable(gameResults);
    }

    // mostra os resultados em formato frente a frente para jogos com 2 joagdores
    function render1v1(players) {
        const container = document.getElementById("stats-container");
        container.innerHTML = "";

        const [p1, p2] = players;
        const stats = ["pontos", "palavras", "erros", "tempo"];

        const header = document.createElement("div");
        header.classList.add("pvp-header");

        header.innerHTML = `
            <div class="player-box">
                <img src="/images/icone-pessoa.png" class="pvp-pfp">
                <div class="pvp-name">${p1.name}</div>
            </div>

            <div></div>

            <div class="player-box">
                <img src="/images/icone-pessoa.png" class="pvp-pfp">
                <div class="pvp-name">${p2.name}</div>
            </div>
        `;

        container.appendChild(header);

        stats.forEach(stat => {
            const row = document.createElement("div");
            row.classList.add("pvp-row");

            row.innerHTML = `
                <span class="pvp-value">${p1.stats[stat]}</span>
                <span class="pvp-label">${stat}</span>
                <span class="pvp-value">${p2.stats[stat]}</span>
            `;

            container.appendChild(row);
        });
    }

    // mostra os resultados em formato de tabela para jogos com mais de 2 joagdores
    function renderTable(players) {
        const container = document.getElementById("stats-container");
        container.innerHTML = "";

        const header = document.createElement("div");
        header.classList.add("mp-row", "mp-header");

        header.innerHTML = `
            <span>Jogador</span>
            <span>Palavras</span>
            <span>Erros</span>
            <span>Tempo</span>
            <span>Pontos</span>
        `;

        container.appendChild(header);

        players.forEach(p => {
            const row = document.createElement("div");
            row.classList.add("mp-row");

            row.innerHTML = `
                <span class="player-cell">
                    <img src="/images/icone-pessoa.png" class="player-pfp">
                    ${p.name}
                </span>
                <span>${p.stats.palavras}</span>
                <span>${p.stats.erros}</span>
                <span>${p.stats.tempo}s</span>
                <span>${p.stats.pontos}</span>
            `;

            container.appendChild(row);
        });
    }

});