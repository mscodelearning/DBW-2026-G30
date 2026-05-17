'use strict';

const form = document.getElementById("formAlterarPassword");
const nova = document.getElementById("nova");
const confirmar = document.getElementById("confirmar");
const erro = document.getElementById("erroPassword");

// valida o formulario de alteracao da palavra-passe antes do envio
form.addEventListener("submit", function(event) {
  // limpa a mensagem de erro anterior
  erro.textContent = "";

  // verifica se a nova palavra-passe tem o numero minimo de caracteres 
  if (nova.value.length < 6) {
    event.preventDefault();
    erro.textContent = "A nova palavra-passe deve ter pelo menos 6 caracteres.";
    return;
  }

  // verifica se a confirmacao coincide com a nova palavra-passe
  if (nova.value !== confirmar.value) {
    event.preventDefault();
    erro.textContent = "A nova palavra-passe e a confirmação não coincidem.";
    return;
  }

});