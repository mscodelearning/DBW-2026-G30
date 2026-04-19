'use strict'

const nomeSalaInput = document.getElementById('nomeSala');
const saveBar = document.getElementById('save-bar');
const btnSave = document.getElementById('btn-save');
const btnReset = document.getElementById('btn-reset');

let originalValue = nomeSalaInput.value;

nomeSalaInput.addEventListener('input', () => {
  const isDirty = nomeSalaInput.value !== originalValue;
  saveBar.classList.toggle('show', isDirty);
});

btnReset.addEventListener('click', () => {
  nomeSalaInput.value = originalValue;
  saveBar.classList.remove('show');
});

btnSave.addEventListener('click', () => {
  console.log('Nome da sala guardado:', nomeSalaInput.value);
  originalValue = nomeSalaInput.value;
  saveBar.classList.remove('show');
});