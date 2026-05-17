'use strict';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // carrega os dados do use autenticado
        const resposta = await fetch("/api/estatisticas/perfil", {
            method: "GET",
            credentials: "include"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao carregar perfil");
        }

        const utilizador = await resposta.json();

        // preenche os campos do perfil com os dados recebidos
        document.getElementById("displayName").value = utilizador.nickname || "";
        document.getElementById("username").value = utilizador.username || "";

        // Nunca preencher a password real
        document.getElementById("password").value = "********";
    } catch (erro) {
        console.error("Erro:", erro);
    }
});

const nicknameInput = document.getElementById('nickname');
const saveBar = document.getElementById('save-bar');
const btnSave = document.getElementById('btn-save');
const btnReset = document.getElementById('btn-reset');

let originalValue = nicknameInput.value;

// mostra a barra de guardar quando o nickname é alterado
nicknameInput.addEventListener('input', () => {
  const isDirty = nicknameInput.value !== originalValue;
  saveBar.classList.toggle('show', isDirty);
});

// repoe o valor original e esconde a barra guardar 
btnReset.addEventListener('click', () => {
  nicknameInput.value = originalValue;
  saveBar.classList.remove('show');
});

//confirma a alteracao atual e atualiza o valor original
btnSave.addEventListener('click', () => {
  console.log('Guardado:', nicknameInput.value);

  originalValue = nicknameInput.value;
  saveBar.classList.remove('show');
});
