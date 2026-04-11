'use strict';

/* Inicio - atualizacao dos dados estatisticos no quadro da pagina do perfil */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/estatisticas/perfil");
        const estatisticas = await response.json();

        document.getElementById("total-pontos").textContent = estatisticas.totalPontos;
        document.getElementById("respostas-encontradas").textContent = estatisticas.respostasEncontradas;
        document.getElementById("respostas-erradas").textContent = estatisticas.respostasErradas;
        document.getElementById("tempo-total").textContent = estatisticas.tempoTotal;
    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
});
/* Fim - atualizacao dos dados estatisticos no quadro da pagina do perfil */