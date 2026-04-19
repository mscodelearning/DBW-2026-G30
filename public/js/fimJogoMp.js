'use strict';

document.addEventListener("DOMContentLoaded", () => {
/*
ANTIGO SÓ PARA SINGLEPLAYER
    const stats = JSON.parse(localStorage.getItem("estatisticasJogo"));

    if (!stats) return;

    document.getElementById("palavras").textContent = stats.palavrasValidas;
    document.getElementById("erros").textContent = stats.erros;
    document.getElementById("pontos").textContent = stats.pontos;
    document.getElementById("tempo").textContent = stats.tempoJogado + "s";*/


    //testar o número de jogadores que aparece no ecra de fim de jogo (comentar alguns dos jogadores)
    const gameResults = JSON.parse(localStorage.getItem("gameResults")) || [
        {
            id: "1",
            name: "Maria",
            stats: { pontos: 120, palavras: 6, erros: 2, tempo: 10 }
        },
        {
            id: "2",
            name: "João",
            stats: { pontos: 80, palavras: 4, erros: 3, tempo: 10 }
        },
        {
            id: "3",
            name: "Mário",
            stats: { pontos: 100, palavras: 5, erros: 1, tempo: 10 }
        },
        {
            id: "4",
            name: "Joana",
            stats: { pontos: 60, palavras: 3, erros: 4, tempo: 10 }
        }
    ];

    const playerCount = gameResults.length;
    const title = document.querySelector("h2");

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

    const vencedor = gameResults.reduce((best, p) =>
        p.stats.pontos > best.stats.pontos ? p : best
    );

    document.getElementById("vencedor").textContent = `Vencedor: ${vencedor.name}`;

    if (gameResults.length === 2) {
        render1v1(gameResults);
    } else {
        renderTable(gameResults);
    }

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