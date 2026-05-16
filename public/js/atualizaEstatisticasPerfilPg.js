'use strict';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/estatisticas/perfil");
        const estatisticas = await response.json();

        document.getElementById("total-pontos").textContent = estatisticas.totalPontos;
        document.getElementById("respostas-encontradas").textContent = estatisticas.respostasEncontradas;
        document.getElementById("respostas-erradas").textContent = estatisticas.respostasErradas;
        document.getElementById("tempo-total").textContent = formatarTempo(estatisticas.tempoTotal);

    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }

    function formatarTempo(segundos) {

        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;

        return `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
    }



});
