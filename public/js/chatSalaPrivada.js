'use strict';

document.addEventListener('DOMContentLoaded', () => {
  console.log("chatSalaPrivada.js carregado");

  const config = document.getElementById('chat-config');
  const mensagemInput = document.getElementById('mensagemInput');
  const sendBtn = document.getElementById('sendBtn');
  const mensagensContainer = document.getElementById('mensagens');

  console.log({ config, mensagemInput, sendBtn, mensagensContainer });

  if (!config || !mensagemInput || !sendBtn || !mensagensContainer) {
    console.log('Elementos do chat não encontrados');
    return;
  }

  let socket = null;

  try {
    socket = io();
    console.log("socket criado com sucesso");
  } catch (error) {
    console.log("erro ao criar socket:", error);
  }

  const salaCodigo = config.dataset.salaCodigo;
  const userId = config.dataset.userId;
  const userName = config.dataset.userName;
  const userAvatar = config.dataset.userAvatar;

  if (socket) {
    socket.emit('joinRoom', salaCodigo);

    socket.on('roomJoined', (roomData) => {
      console.log('roomJoined', roomData);
    });

    socket.on('chatHistory', (historico) => {
      console.log('chatHistory', historico);
      mensagensContainer.innerHTML = '';
      historico.forEach((msg) => renderMensagem(msg));
      scrollToBottom();
    });

    socket.on('clientChat', (msg) => {
      console.log('clientChat', msg);
      renderMensagem(msg);
      scrollToBottom();
    });
  }

  sendBtn.addEventListener('click', enviarMensagem);

  mensagemInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviarMensagem();
    }
  });

  function enviarMensagem() {
    const texto = mensagemInput.value.trim();
    console.log("enviarMensagem chamada", texto);

    if (!texto) return;

    if (socket) {
      socket.emit('chat', {
        sala: salaCodigo,
        mensagem: texto,
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar,
      });
    } else {
      console.log("socket indisponível");
    }

    mensagemInput.value = '';
    mensagemInput.focus();
  }

  function renderMensagem(msg) {
    const minhaMensagem = String(msg.senderId) === String(userId);

    const wrapper = document.createElement('div');
    wrapper.className = minhaMensagem ? 'msg msg-minha' : 'msg msg-outra';

    wrapper.innerHTML = `
      <img class="msg-avatar" src="${msg.senderAvatar || '/symbols/Union-user-icon.png'}" alt="avatar">
      <div class="msg-bolha">
        <div class="msg-nome">${escapeHtml(msg.senderName || 'Utilizador')}</div>
        <div class="msg-texto">${escapeHtml(msg.mensagem)}</div>
      </div>
    `;

    mensagensContainer.appendChild(wrapper);
  }

  function scrollToBottom() {
    mensagensContainer.scrollTop = mensagensContainer.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});