'use strict';

const input = document.getElementById("mensagemInput");
const sendBtn = document.getElementById("sendBtn");
const mensagens = document.getElementById("mensagens");

function enviarMensagem() {
  const texto = input.value.trim();

  if (texto === "") return;

  const novaMensagem = document.createElement("div");
  novaMensagem.classList.add("mensagem");
  novaMensagem.textContent = texto;

  mensagens.appendChild(novaMensagem);
  input.value = "";
  mensagens.scrollTop = mensagens.scrollHeight;
}

sendBtn.addEventListener("click", enviarMensagem);

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    enviarMensagem();
  }
});