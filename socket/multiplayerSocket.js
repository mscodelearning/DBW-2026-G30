import Sala from "../models/sala.js";
import { refreshRoomExpiry, novaDataExpiracao } from "../services/roomExpiryService.js";
import ChatMessage from "../models/chatMessageModel.js";

import {
    getRandomPalavraMestra,
    gerarPalavrasValidas
} from "../services/gameService.js";

const socketsSalas = new Map();
const disconnectTimers = new Map();


function isHost(sala, userId) {
    return sala.host.toString() === userId.toString();
}


export default function multiplayerSocket(io) {
  io.on("connection", (socket) => {
    console.log(`Utilizador ligado: ${socket.id}`);

    socket.on("joinMultiplayerRoom", async ({ codigoSala, userId }) => {
      try {
        const codigoNormalizado = codigoSala?.trim().toUpperCase();

        if (!codigoNormalizado) {
          console.log("Código da sala inválido no socket");
          return;
        }

        socket.join(codigoNormalizado);
        socketsSalas.set(socket.id, { codigoSala: codigoNormalizado, userId });

        for (const [key, timer] of disconnectTimers.entries()) {
  if (key.endsWith(`-${userId}`)) {
    clearTimeout(timer);
    disconnectTimers.delete(key);
    console.log(`Reconexão detectada para ${userId} no timer ${key}`);
  }
}


        console.log("Tentando procurar sala com código:", JSON.stringify(codigoNormalizado));

        const sala = await Sala.findOne({ codigo: codigoNormalizado });

        if (!sala) {
          console.log(`Sala ${codigoNormalizado} não encontrada ao entrar`);
          return;
        }

        if (!sala.isDefault) {
          await refreshRoomExpiry(codigoNormalizado);
        } else if (sala.expireAt) {
          sala.expireAt = null;
          await sala.save();
        }

        io.to(codigoNormalizado).emit("playersUpdated", sala.jogadores);
        console.log(`playersUpdated emitido para sala ${codigoNormalizado}`, sala.jogadores);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("joinRoom", async (roomName) => {
      try {
        const normalizedRoom = roomName?.trim().toUpperCase();
        if (!normalizedRoom) return;

        const sala = await Sala.findOne({ codigo: normalizedRoom });
        if (sala && !sala.isDefault) {
          await refreshRoomExpiry(normalizedRoom);
        }

        if (socket.data.currentRoom) {
          socket.leave(socket.data.currentRoom);
        }

        socket.join(normalizedRoom);
        socket.data.currentRoom = normalizedRoom;

        console.log(`Socket ${socket.id} entrou no chat da sala ${normalizedRoom}`);

        socket.emit("roomJoined", {
          sala: normalizedRoom,
          socketID: socket.id,
        });

        const historico = await ChatMessage.find({ salaCodigo: normalizedRoom })
          .sort({ createdAt: 1 })
          .limit(100);

        socket.emit("chatHistory", historico);
      } catch (err) {
        console.log("Erro ao entrar na sala / carregar histórico:", err);
      }
    });

    socket.on("chat", async (msgData) => {
      try {
        const normalizedMessage = msgData?.mensagem?.trim();
        const normalizedRoom = msgData?.sala?.trim().toUpperCase();

        if (!normalizedMessage || !normalizedRoom) return;

        const sala = await Sala.findOne({ codigo: normalizedRoom });
        if (sala && !sala.isDefault) {
          await refreshRoomExpiry(normalizedRoom);
        }

        const novaMensagem = await ChatMessage.create({
          salaCodigo: normalizedRoom,
          senderId: msgData.senderId,
          senderName: msgData.senderName || "Utilizador",
          senderAvatar: msgData.senderAvatar || "/symbols/Union-user-icon.png",
          mensagem: normalizedMessage,
        });

        const paraCliente = {
          _id: novaMensagem._id,
          senderId: String(novaMensagem.senderId),
          senderName: novaMensagem.senderName,
          senderAvatar: novaMensagem.senderAvatar,
          mensagem: novaMensagem.mensagem,
          sala: normalizedRoom,
          createdAt: novaMensagem.createdAt,
        };

        io.to(normalizedRoom).emit("clientChat", paraCliente);
      } catch (err) {
        console.log("Erro ao guardar/enviar mensagem:", err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        console.log("Socket desconectado");

        const dadosSocket = socketsSalas.get(socket.id);
        if (!dadosSocket) {
          console.log(`Utilizador desligado: ${socket.id}`);
          return;
        }

        const { codigoSala, userId } = dadosSocket; socketsSalas.delete(socket.id);

        const pendingKey = `${codigoSala}-${userId}`;

        const timer = setTimeout(async () => {
  try {
    console.log(`Removendo jogador ${userId}`);

    const salaAtual = await Sala.findOne({ codigo: codigoSala });
    if (!salaAtual) {
      disconnectTimers.delete(pendingKey);
      return;
    }

    console.log("CHECK BEFORE REMOVE", {
  socketId: socket.id,
  codigoSala,
  userId: userId.toString(),
  activeSockets: [...socketsSalas.entries()].map(([id, dados]) => ({
    socketId: id,
    codigoSala: dados.codigoSala,
    userId: dados.userId?.toString()
  }))
});

    const stillConnected = [...socketsSalas.values()].some(
      dados =>
        dados.codigoSala === codigoSala &&
        dados.userId?.toString() === userId.toString()
    );

    if (stillConnected) {
      console.log(`Jogador ${userId} reconectou`);
      disconnectTimers.delete(pendingKey);
      return;
    }

    const jogadoresAtualizados = salaAtual.jogadores.filter(
      jogador => jogador.id.toString() !== userId.toString()
    );

    const update = {
      jogadores: jogadoresAtualizados,
      expireAt: salaAtual.isDefault ? null : novaDataExpiracao(10)
    };

    if (jogadoresAtualizados.length === 0) {
      update.estado = "waiting";
      update.jogo = {
        iniciado: false,
        palavraMestra: null,
        palavrasValidas: [],
        inicio: null,
        palavrasDescobertas: {},
        pontuacoes: {}
      };
    }

    await Sala.updateOne(
      { _id: salaAtual._id },
      { $set: update }
    );

    if (jogadoresAtualizados.length > 0) {
      io.to(codigoSala).emit("playersUpdated", jogadoresAtualizados);
    }

    disconnectTimers.delete(pendingKey);
  } catch (err) {
    console.error(err);
    disconnectTimers.delete(pendingKey);
  }
}, 5000);
          


        disconnectTimers.set(pendingKey, timer);
        console.log(`Utilizador desligado: ${socket.id}`);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("leaveRoom", async (codigoSala) => {
      try {
        const codigoNormalizado = codigoSala?.trim().toUpperCase();
        socket.leave(codigoNormalizado);

        const sala = await Sala.findOne({ codigo: codigoNormalizado });
        if (!sala) return;

        io.to(codigoNormalizado).emit("playersUpdated", sala.jogadores);
      } catch (err) {
        console.error(err);
      }
    });

socket.on("startGame", async ({ codigoSala, userId }) => {
    try {
        const codigoNormalizado = codigoSala?.trim().toUpperCase();

        const sala = await Sala.findOne({codigo: codigoNormalizado});

        if (!sala) {
            return socket.emit("erroSala", {mensagem: "Sala não encontrada."});
        }

        const isPublicRoom = sala.configuracoes.access === "Público";

        if (!isPublicRoom && !isHost(sala, userId)) {
            return socket.emit("erroSala", {mensagem:"Só o administrador pode iniciar uma sala privada."});
        }

        if (sala.jogo?.iniciado || sala.estado === "playing") {
            return socket.emit("erroSala", {mensagem: "O jogo já foi iniciado."});
        }

        if (sala.jogadores.length < 2) {
            return socket.emit("erroSala", {mensagem:"São necessários pelo menos 2 jogadores para iniciar."});
        }

        const palavraMestra = getRandomPalavraMestra();
        const palavrasValidas = gerarPalavrasValidas(palavraMestra);

        const timer = sala.configuracoes.timer || 0;

        sala.jogo = {
            iniciado: true,
            terminado: false,
            palavraMestra,
            palavrasValidas,
            inicio: new Date(),
            fimJogo: timer > 0 ? Date.now() + (timer * 1000) : null,
            palavrasDescobertas: {},
            pontuacoes: {}
        };
        sala.estado = "playing";
        await sala.save();

        io.to(codigoNormalizado).emit("gameStarted", {
                codigoSala: codigoNormalizado,
                palavraMestra,
                configuracoes: sala.configuracoes,
                jogadores: sala.jogadores
            }
        );

        if (timer > 0) {
            setTimeout(async () => {
                try {
                    const salaAtual = await Sala.findOne({ codigo: codigoNormalizado });

                    if (!salaAtual) {
                        return;
                    }

                    if (salaAtual.jogo?.terminado) { return; }

                    salaAtual.jogo.terminado = true;

                    salaAtual.estado = "waiting";

                    await salaAtual.save();

                    console.log("FINAL ROOM PLAYERS");
                    console.log(salaAtual.jogadores);

                    const resultados = salaAtual.jogadores.map(jogador => ({
                            id: jogador.id,
                            name: jogador.nickname,
                            stats: {
                                pontos:
                                    jogador.pontos || 0,
                                palavras:
                                    jogador.palavras || 0,
                                erros:
                                    jogador.erros || 0,
                                tempo: timer
                            }
                        }));

                    console.log("RESULTADOS");
                    console.log(resultados);

                    io.to(codigoNormalizado).emit("gameFinished", resultados);

                } catch (err) {
                    console.error(err);
                }
            }, timer * 1000);
        }

    } catch (err) {
        console.error("Erro ao iniciar jogo:", err);
        socket.emit("erroSala", { mensagem: "Erro ao iniciar o jogo."});
    }
});

socket.on("endGame", async ({ codigoSala }) => {
  try {
    const codigoNormalizado = codigoSala?.trim().toUpperCase();
    const sala = await Sala.findOne({ codigo: codigoNormalizado });

    if (!sala) return;

    sala.estado = "waiting";
    sala.jogo = {
      iniciado: false,
      palavraMestra: null,
      palavrasValidas: [],
      inicio: null,
      palavrasDescobertas: {},
      pontuacoes: {}
    };

    await sala.save();

    io.to(codigoNormalizado).emit("gameEnded", {
      codigoSala: codigoNormalizado,
      jogadores: sala.jogadores
    });

    console.log(`Jogo terminado na sala ${codigoNormalizado}`);
  } catch (err) {
    console.error("Erro ao terminar jogo:", err);
  }
});








    socket.on("submitWord", async ({ codigoSala, userId, palavra }) => {

        try {

            const codigoNormalizado = codigoSala.trim().toUpperCase();

            const sala = await Sala.findOne({codigo: codigoNormalizado});

            if (!sala || !sala.jogo.iniciado) {
                return;
            }

            if (sala.jogo.terminado) {
                return;
            }

            const palavraNormalizada = palavra.trim().toLowerCase();

            if (sala.jogo.palavrasDescobertas[userId] === undefined) {
                  sala.jogo.palavrasDescobertas[userId] = [];
            }

            if (
                sala.jogo.palavrasDescobertas[userId].includes(palavraNormalizada)) {

                socket.emit("wordResult", {
                    success: false,
                    message: "Palavra já descoberta"
                });

                return;
            }

            if (sala.jogo.palavrasValidas.includes(palavraNormalizada)) {

                sala.jogo.palavrasDescobertas[userId].push(palavraNormalizada);

                if (sala.jogo.pontuacoes[userId] === undefined) {
                    sala.jogo.pontuacoes[userId] = 0;
                }


                console.log("ANTES:");
                console.log(sala.jogo.pontuacoes[userId]);
                console.log("word length:", palavraNormalizada.length);


                sala.jogo.pontuacoes[userId] += palavraNormalizada.length;

                console.log("DEPOIS:");
                console.log(sala.jogo.pontuacoes[userId]);


                const jogador = sala.jogadores.find(j => j.id.toString() === userId.toString());

                jogador.pontos = sala.jogo.pontuacoes[userId];

                jogador.palavras = sala.jogo.palavrasDescobertas[userId].length;//novo


                sala.markModified("jogo.pontuacoes");
                sala.markModified("jogo.palavrasDescobertas");

                await sala.save();

                io.to(codigoNormalizado).emit("scoreUpdated", {
                    userId,
                    pontos: jogador.pontos
                });

                socket.emit("wordResult", {
                    success: true,
                    palavra: palavraNormalizada,

                    pontos: sala.jogo.pontuacoes[userId],

                    totalDescobertas:sala.jogo.palavrasDescobertas[userId].length
                });
                return;
            }

            socket.emit("wordResult", {
                success: false,
                message: "Palavra inválida"
            });

        } catch (err) {
            console.error(err);
        }
    });

    socket.on("updateErrors", async ({ codigoSala, userId, erros }) => {

        const sala = await Sala.findOne({ codigo: codigoSala });

        if (!sala) return;

        const jogador = sala.jogadores.find(
            j => j.id.toString() === userId.toString()
        );

        if (!jogador) return;

        jogador.erros = erros;

        await sala.save();
    });

    socket.on("finishGame", async ({ codigoSala, tempo }) => {

        const sala = await Sala.findOne({ codigo: codigoSala });

        if (!sala) return;

        console.log("FINAL ROOM PLAYERS");
        console.log(sala.jogadores);

        const resultados = sala.jogadores.map(jogador => ({
            id: jogador.id,

            name: jogador.nickname,

            stats: {
                pontos: jogador.pontos || 0,
                palavras: jogador.palavras || 0,
                erros: jogador.erros || 0,
                tempo
            }
        }));

        if (sala.jogo.terminado) return;

        sala.jogo.terminado = true;
        await sala.save();

        io.to(codigoSala).emit(
            "gameFinished",
            resultados
        );
        console.log("RESULTADOS");
        console.log(resultados);
    });
  });
}