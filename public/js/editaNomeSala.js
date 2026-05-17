'use strict'

const nomeSalaInput = document.getElementById('nomeSala');
const saveBar = document.getElementById('save-bar');
const btnSave = document.getElementById('btn-save');
const btnReset = document.getElementById('btn-reset');
const config = document.getElementById('chat-config');

const salaCodigo = config.dataset.salaCodigo;

let originalValue = nomeSalaInput.value;

// mostra a barra de guardar quando o nome da sala é alterado 
nomeSalaInput.addEventListener('input', () => {
  const isDirty = nomeSalaInput.value !== originalValue;
  saveBar.classList.toggle('show', isDirty);
});

// repoe o nome original da sala e esconde a barra de guardar 
btnReset.addEventListener('click', () => {
  nomeSalaInput.value = originalValue;
  saveBar.classList.remove('show');
});

// guarda o novo nome da sala no servidor
btnSave.addEventListener('click', async () => {
  const novoNome = nomeSalaInput.value.trim();

  if (!novoNome) {
    alert('O nome da sala não pode estar vazio.');
    return;
  }

  try {
    const response = await fetch(`/multiplayer/sala/${salaCodigo}/nome`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome: novoNome })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Erro ao guardar nome da sala.');
      return;
    }

    // atualiza o valor original apos guardar com sucesso
    originalValue = data.sala.nome;
    nomeSalaInput.value = data.sala.nome;
    saveBar.classList.remove('show');
  } catch (error) {
    console.error('Erro ao guardar nome da sala:', error);
    alert('Erro ao guardar nome da sala.');
  }
});