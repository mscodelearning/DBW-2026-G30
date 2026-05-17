'use strict';



/**
 * Gere o sistema de chat em tempo real da sala, incluindo envio, receção e renderização de mensagens através de sockets.
 */
document.addEventListener("DOMContentLoaded", () => {
  const socket = window.socket;

  const config = document.getElementById("chat-config");
  const salaCodigo = config.dataset.salaCodigo;
  const userId = config.dataset.userId;
  const userName = config.dataset.userName;
  const userAvatar = config.dataset.userAvatar;

  const mensagensContainer = document.getElementById("mensagens");
  const mensagemInput = document.getElementById("mensagemInput");
  const sendBtn = document.getElementById("sendBtn");

  socket.emit("joinRoom", salaCodigo);

  socket.on("chatHistory", (historico) => {
    mensagensContainer.innerHTML = "";
    historico.forEach(renderMensagem);
    scrollToBottom();
  });

  socket.on("clientChat", (msg) => {
    renderMensagem(msg);
    scrollToBottom();
  });

  sendBtn.addEventListener("click", enviarMensagem);

  mensagemInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      enviarMensagem();
    }
  });


  /**
   * envia uma nova mensagem para o chat da sala através do socket.
   * @returns {void}
   */
  function enviarMensagem() {
    const texto = mensagemInput.value.trim();
    if (!texto) return;

    socket.emit("chat", {
      sala: salaCodigo,
      mensagem: texto,
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
    });

    mensagemInput.value = "";
    mensagemInput.focus();
  }


  /**
   * cria e adiciona visualmente uma mensagem ao chat,
   * diferenciando mensagens do próprio utilizador das mensagens de outros jogadores.
   * @param {Object} msg dados da mensagem recebida
   */
  function renderMensagem(msg) {
    const minhaMensagem = String(msg.senderId) === String(userId);    //msg.senderId - id do user que mandou a mensagem

    const wrapper = document.createElement("div");
    wrapper.className = minhaMensagem ? "msg msg-minha" : "msg msg-outra";


    //msg.mensagem - conteúdo da mensagem
    wrapper.innerHTML = `
      <img class="msg-avatar" src="${msg.senderAvatar || '/symbols/Union-user-icon.png'}" alt="avatar">
      <div class="msg-bolha">
        <div class="msg-nome">${msg.senderName || "Utilizador"}</div>
        <div class="msg-texto">${msg.mensagem}</div>
      </div>
    `;

    mensagensContainer.appendChild(wrapper);
  }


  /**
   * faz scroll automático até à última mensagem do chat
   * @returns {void}
   */
  function scrollToBottom() {
    mensagensContainer.scrollTop = mensagensContainer.scrollHeight;
  }
});