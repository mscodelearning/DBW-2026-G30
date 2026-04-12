'use strict';

document.addEventListener("DOMContentLoaded", () => {

    const stats = JSON.parse(localStorage.getItem("estatisticasJogo"));

    if (!stats) return;

    document.getElementById("palavras").textContent = stats.palavrasValidas;
    document.getElementById("erros").textContent = stats.erros;
    document.getElementById("pontos").textContent = stats.pontos;
    document.getElementById("tempo").textContent = stats.tempoJogado + "s";
});