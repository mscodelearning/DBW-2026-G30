'use strict';

const form = document.getElementById("formAlterarPassword");
const nova = document.getElementById("nova");
const confirmar = document.getElementById("confirmar");
const erro = document.getElementById("erroPassword");

form.addEventListener("submit", function(event) {
  erro.textContent = "";

  if (nova.value.length < 6) {
    event.preventDefault();
    erro.textContent = "A nova palavra-passe deve ter pelo menos 6 caracteres.";
    return;
  }

  if (nova.value !== confirmar.value) {
    event.preventDefault();
    erro.textContent = "A nova palavra-passe e a confirmação não coincidem.";
    return;
  }

});