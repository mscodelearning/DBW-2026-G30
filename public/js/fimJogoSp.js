'use strict';


document.addEventListener("DOMContentLoaded", () => {

  // carrega as estatisticas finais do jogo guardadas no navegador
    const stats = JSON.parse(localStorage.getItem("estatisticasJogo"));

    if (!stats) return;

    // mostra as estitisticas do jogador na pagina inical
    document.getElementById("palavras").textContent = stats.palavrasDescobertas;
    document.getElementById("erros").textContent = stats.erros;
    document.getElementById("pontos").textContent = stats.pontos;
    document.getElementById("tempo").textContent = stats.tempoJogado + "s";


    document.getElementById("nome-jogador").textContent =
    stats.nickname || stats.username || "Jogador";

  document.getElementById("avatar-jogador").src =
    stats.avatar || "/images/icone-pessoa.png";

});