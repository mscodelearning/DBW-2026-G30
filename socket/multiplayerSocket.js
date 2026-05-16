import Sala from "../models/sala.js";
import { refreshRoomExpiry, novaDataExpiracao } from "../services/roomExpiryService.js";
import ChatMessage from "../models/chatMessageModel.js"; //////////////////////////////////

import {
    getRandomPalavraMestra,
    gerarPalavrasValidas
} from "../services/gameService.js";

const socketsSalas = new Map();
const disconnectTimers = new Map();


function isHost(sala, userId) {
    return sala.host.toString() === userId.toString();
}

/*
export default function multiplayerSocket(io) {

    io.on("connection", (socket) => {

        /*console.log("Novo socket:", socket.id);*/

        /* jogador entra numa sala socket*/
        /*socket.on("joinRoom", async (codigoSala) => {*/


/*
antigo
        socket.on("joinMultiplayerRoom", async ({ codigoSala, userId }) => {
            try {
                socket.join(codigoSala);
                socketsSalas.set(socket.id, { codigoSala, userId});
////////////////////////////////////////////////////
                // carrega sala para dedpois definir a condicao the expiryDate/time
                const sala = await Sala.findOne({ codigo: codigoSala });
                if (!sala) {
                    console.warn(`Sala ${codigoSala} não encontrada ao entrar`);
                    return;
                }
                
                // atualiza a expiryDate/time so para as salas que nao sao default
                if (!sala.isDefault) {
                    await refreshRoomExpiry(codigoSala);// temporizador para eliminar sala da refresh ao timer
                } else {
                    // garante que as salas default nao têm expiryDate/time
                    if (sala.expireAt) {
                        sala.expireAt = null;
                        await sala.save();
                    }
                }
//////////////////////////////////////////////

                const pendingKey =`${codigoSala}-${userId}`;

                if (disconnectTimers.has(pendingKey)) {
                    clearTimeout(disconnectTimers.get(pendingKey));
                    disconnectTimers.delete(pendingKey);
                    console.log(`Reconexão detectada para ${userId}`);
                }

                console.log(`Socket entrou na sala ${codigoSala}`);
                
                await Sala.findOne({ codigo: codigoSala});

                if (!sala) { return; }

                /* enviar lista atualizada para todos na sala
                io.to(codigoSala).emit( "playersUpdated", sala.jogadores);

            } catch (err) {
                console.error(err);
            }

        });*/


/*

novo
        socket.on("joinMultiplayerRoom", async ({ codigoSala, userId }) => {
  try {
    const codigoNormalizado = codigoSala?.trim().toUpperCase();

    if (!codigoNormalizado) {
      console.log("Código da sala inválido no socket");
      return;
    }

    socket.join(codigoNormalizado);
    socketsSalas.set(socket.id, { codigoSala: codigoNormalizado, userId });

    const pendingKey = `${codigoNormalizado}-${userId}`;

    if (disconnectTimers.has(pendingKey)) {
      clearTimeout(disconnectTimers.get(pendingKey));
      disconnectTimers.delete(pendingKey);
      console.log(`Reconexão detectada para ${userId}`);
    }

    console.log("Tentando procurar sala com código:", JSON.stringify(codigoNormalizado));/////////////////////////temp

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
});*/

////////////////////////////////////////////
//antigo
        /*
        socket.on("disconnect", async () => {
            try {
                console.log("Socket desconectado");
                const dadosSocket = socketsSalas.get(socket.id);
                if (!dadosSocket) {
                    return;
                }
                const { codigoSala, userId } = dadosSocket;
                socketsSalas.delete(socket.id);
                const pendingKey = `${codigoSala}-${userId}`;
                const timer = setTimeout(async () => {
                    try {
                        console.log(`Removendo jogador ${userId}`);
                        const sala = await Sala.findOne({ codigo: codigoSala });
                        if (!sala) { return; }
                        const stillConnected =
                            [...socketsSalas.values()].some(
                                dados => dados.codigoSala === codigoSala && dados.userId.toString() === userId.toString() );
                        if (stillConnected) {
                            console.log(`Jogador ${userId} reconectou`);
                            return;
                        }
                        sala.jogadores =
                            sala.jogadores.filter( jogador => jogador.id.toString() !== userId.toString());

                        if (sala.jogadores.length === 0) {
                            await Sala.deleteOne({
                                _id: sala._id
                            });
                            console.log(`Sala ${codigoSala} apagada`);
                        } else {
                            await sala.save();
                            io.to(codigoSala).emit("playersUpdated", sala.jogadores);
                        }
                        disconnectTimers.delete(pendingKey);
                    } catch (err) {
                        console.error(err);
                    }
                }, 5000);
                disconnectTimers.set(pendingKey,timer);
            } catch (err) {
                console.error(err);
            }
        });*/
//////////////////////////////////////////////////////////////////////////////////
/*
novo
        socket.on("disconnect", async () => {
  try {
    console.log("Socket desconectado");

    const dadosSocket = socketsSalas.get(socket.id);
    if (!dadosSocket) return;

    const { codigoSala, userId } = dadosSocket;
    socketsSalas.delete(socket.id);

    const pendingKey = `${codigoSala}-${userId}`;

    const timer = setTimeout(async () => {
      try {
        console.log(`Removendo jogador ${userId}`);

        const sala = await Sala.findOne({ codigo: codigoSala });
        if (!sala) {
            disconnectTimers.delete(pendingKey);
            return;
        } 

        const stillConnected = [...socketsSalas.values()].some(
          dados =>
            dados.codigoSala === codigoSala &&
            dados.userId.toString() === userId.toString()
        );

        if (stillConnected) {
          console.log(`Jogador ${userId} reconectou`);
          disconnectTimers.delete(pendingKey);
          return;
        }

        sala.jogadores = sala.jogadores.filter(
          jogador => jogador.id.toString() !== userId.toString()
        );

        if (sala.jogadores.length === 0) {
          if (sala.isDefault) {
            sala.estado = "waiting";
            sala.expireAt = null;
            await sala.save();
            console.log(`Sala default ${codigoSala} preservada`);
          } else {
            await Sala.deleteOne({ _id: sala._id });
            console.log(`Sala ${codigoSala} apagada`);
          }
        } else {
          if (!sala.isDefault) {
            sala.expireAt = novaDataExpiracao(10);
          } else {
            sala.expireAt = null;
          }

          await sala.save();
          io.to(codigoSala).emit("playersUpdated", sala.jogadores);
        }

        disconnectTimers.delete(pendingKey);
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    disconnectTimers.set(pendingKey, timer);
  } catch (err) {
    console.error(err);
  }
});


        socket.on("leaveRoom", async (codigoSala) => {
            try {
                socket.leave(codigoSala);
                const sala = await Sala.findOne({ codigo: codigoSala });

                if (!sala) {
                    return;
                }

                io.to(codigoSala).emit( "playersUpdated", sala.jogadores);

            } catch (err) {
                console.error(err);
            }
        });
    });
}

*/






///////////////////// colocar o flow do chatessagesocket junto com o do multiplayerocket


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
/*
        const pendingKey = `${codigoNormalizado}-${userId}`;

        if (disconnectTimers.has(pendingKey)) {
          clearTimeout(disconnectTimers.get(pendingKey));
          disconnectTimers.delete(pendingKey);
          console.log(`Reconexão detectada para ${userId}`);
        }
*/

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

/*NOVO
socket.on("startGame", async ({ codigoSala, userId }) => {

    const sala = await Sala.findOne({
        codigo: codigoSala
    });

    if (!sala) {
        return;
    }

    const palavraMestra =
        getRandomPalavraMestra();

    const palavrasValidas =
        gerarPalavrasValidas(palavraMestra);

    sala.jogo = {
        palavraMestra,
        palavrasValidas,
        palavrasDescobertas: [],
        pontuacoes: {}
    };

    await sala.save();

    io.to(codigoSala).emit("gameStarted", {
        codigoSala,
        palavraMestra,
        configuracoes: sala.configuracoes,
        jogadores: sala.jogadores
    });
});*/


/*
antigo
   /* socket.on("startGame", async ({ codigoSala, userId }) => {

//NOVO
        const fimJogo = Date.now() + (timer * 1000);
        sala.jogo.fimJogo = fimJogo;
        setTimeout(async () => {

            // lock game
            sala.jogo.terminado = true;

            await sala.save();

            // build results
            // emit gameFinished

        }, timer * 1000);
//NOVO

        try {
            const sala = await Sala.findOne({ codigo: codigoSala });
            const palavraMestra = getRandomPalavraMestra();
            const palavrasValidas = gerarPalavrasValidas(palavraMestra);

            if (!sala) { return; }

            // so o host
            if (!isHost(sala, userId)) {

                socket.emit("roomError", "Apenas o host pode iniciar o jogo");
                return;
            }

            sala.jogo = {
                palavraMestra,
                palavrasValidas,
                palavrasDescobertas: {},
                pontuacoes: {}
            };
            sala.estado = "playing";
            sala.jogo.iniciado = true;
            sala.jogo.inicio = new Date();
            await sala.save();*/

            /*io.to(codigoSala).emit("gameStarted", {
                    codigoSala,
                    configuracoes: sala.configuracoes,
                    jogadores: sala.jogadores
                }
            );*/



            /*
            /*io.to(codigoSala).emit("gameStarted", {
                codigoSala,
                palavraMestra,
                configuracoes: sala.configuracoes,
                jogadores: sala.jogadores
            });

        } catch (err) {
            console.error(err);
        }
    });*/


    /*socket.on("startGame", async ({ codigoSala, userId }) => {

        try {

            const sala = await Sala.findOne({ codigo: codigoSala });

            if (!sala) {
                return;
            }

            // só o host pode iniciar
            if (!isHost(sala, userId)) {

                socket.emit("roomError", "Apenas o host pode iniciar o jogo");

                return;
            }

            const palavraMestra = getRandomPalavraMestra();

            const palavrasValidas =
                gerarPalavrasValidas(palavraMestra);

            const timer =
                sala.configuracoes.timer || 0;

            sala.jogo = {
                palavraMestra,
                palavrasValidas,
                palavrasDescobertas: {},
                pontuacoes: {},
                terminado: false,
                iniciado: true,
                inicio: new Date(),
                fimJogo:
                    timer > 0
                        ? Date.now() + (timer * 1000)
                        : null
            };

            sala.estado = "playing";

            await sala.save();

            io.to(codigoSala).emit("gameStarted", {
                codigoSala,
                palavraMestra,
                configuracoes: sala.configuracoes,
                jogadores: sala.jogadores
            });

            // jogo com timer
            if (timer > 0) {

                setTimeout(async () => {

                    try {

                        const salaAtual =
                            await Sala.findOne({
                                codigo: codigoSala
                            });

                        if (!salaAtual) return;

                        // impedir finish duplicado
                        if (salaAtual.jogo.terminado) {
                            return;
                        }

                        salaAtual.jogo.terminado = true;

                        await salaAtual.save();

                        console.log("FINAL ROOM PLAYERS");
                        console.log(salaAtual.jogadores);

                        const resultados =
                            salaAtual.jogadores.map(jogador => ({
                                id: jogador.id,

                                name: jogador.nickname,

                                stats: {
                                    pontos: jogador.pontos || 0,
                                    palavras: jogador.palavras || 0,
                                    erros: jogador.erros || 0,
                                    tempo: timer
                                }
                            }));

                        console.log("RESULTADOS");
                        console.log(resultados);

                        io.to(codigoSala).emit(
                            "gameFinished",
                            resultados
                        );

                    } catch (err) {

                        console.error(err);
                    }

                }, timer * 1000);
            }

        } catch (err) {

            console.error(err);
        }
    });*/

  /*NOVO COM A LOGICA TAMBEM PARA A SALA PUBLICA
  socket.on("startGame", async ({ codigoSala, userId }) => {
    try {
        const codigoNormalizado = codigoSala?.trim().toUpperCase();
        const sala = await Sala.findOne({ codigo: codigoNormalizado });

        if (!sala) {
            return socket.emit("erroSala", {
                mensagem: "Sala não encontrada."
            });
        }

        const isPublicRoom = sala.configuracoes.access === "Público";

        if (!isPublicRoom && !isHost(sala, userId)) {
            return socket.emit("erroSala", {
                mensagem: "Só o administrador pode iniciar uma sala privada."
            });
        }

        if (sala.jogo?.iniciado || sala.estado === "playing") {
            return socket.emit("erroSala", {
                mensagem: "O jogo já foi iniciado."
            });
        }

        if (sala.jogadores.length < 2) {
            return socket.emit("erroSala", {
                mensagem: "São necessários pelo menos 2 jogadores para iniciar."
            });
        }

        const palavraMestra = getRandomPalavraMestra();
        const palavrasValidas = gerarPalavrasValidas(palavraMestra);

        sala.jogo = {
            iniciado: true,
            palavraMestra,
            palavrasValidas,
            inicio: new Date(),
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
        });

    } catch (err) {
        console.error("Erro ao iniciar jogo:", err);
        socket.emit("erroSala", {
            mensagem: "Erro ao iniciar o jogo."
        });
    }
});*/

//alterado depois do problema do merge
socket.on("startGame", async ({ codigoSala, userId }) => {
    try {
        const codigoNormalizado = codigoSala?.trim().toUpperCase();

        const sala = await Sala.findOne({codigo: codigoNormalizado});

        if (!sala) {
            return socket.emit("erroSala", {mensagem: "Sala não encontrada."});
        }

        // sala pública pode iniciar sem host
        const isPublicRoom = sala.configuracoes.access === "Público";

        // privada apenas host
        if (!isPublicRoom && !isHost(sala, userId)) {
            return socket.emit("erroSala", {mensagem:"Só o administrador pode iniciar uma sala privada."});
        }

        // impedir duplicados
        if (sala.jogo?.iniciado || sala.estado === "playing") {
            return socket.emit("erroSala", {mensagem: "O jogo já foi iniciado."});
        }

        // mínimo jogadores
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

        // jogo com timer
        if (timer > 0) {
            setTimeout(async () => {
                try {
                    const salaAtual = await Sala.findOne({ codigo: codigoNormalizado });

                    if (!salaAtual) {
                        return;
                    }

                    // impedir finish duplicado
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
});//alterado depois do problema do merge

//novo codigo 
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







    //NOVO
    /*socket.on("submitWord", async ({ codigoSala, userId, palavra }) => {

      try {

          const codigoNormalizado =
              codigoSala.trim().toUpperCase();

          const sala = await Sala.findOne({
              codigo: codigoNormalizado
          });

          if (!sala || !sala.jogo.iniciado) {
              return;
          }

          const palavraNormalizada =
              palavra.trim().toLowerCase();

          // já descoberta
          if (
              sala.jogo.palavrasDescobertas.includes(
                  palavraNormalizada
              )
          ) {

              socket.emit("wordResult", {
                  success: false,
                  message: "Palavra já descoberta"
              });

              return;
          }

          // palavra válida
          if (
              sala.jogo.palavrasValidas.includes(
                  palavraNormalizada
              )
          ) {

              sala.jogo.palavrasDescobertas.push(
                  palavraNormalizada
              );

              // descobrir jogador
              const dadosSocket =
                  socketsSalas.get(socket.id);

              const userId =
                  dadosSocket.userId.toString();

              // iniciar score se necessário
              if (!sala.jogo.pontuacoes[userId]) {
                  sala.jogo.pontuacoes[userId] = 0;
              }

              sala.jogo.pontuacoes[userId] +=
                  palavraNormalizada.length;

              await sala.save();

              socket.emit("wordResult", {
                  success: true,
                  palavra: palavraNormalizada,
                  pontos: sala.jogo.pontuacoes[userId],
                  totalDescobertas:
                      sala.jogo.palavrasDescobertas.length
              });

              return;
          }

          // inválida
          socket.emit("wordResult", {
              success: false,
              message: "Palavra inválida"
          });

      } catch (err) {

          console.error(err);
      }
  });*/

    socket.on("submitWord", async ({ codigoSala, userId, palavra }) => {

        try {

            const codigoNormalizado = codigoSala.trim().toUpperCase();

            const sala = await Sala.findOne({codigo: codigoNormalizado});

            if (!sala || !sala.jogo.iniciado) {
                return;
            }

            //impede que sejam submetidas palavras caso o jogo ja tenha terminado
            if (sala.jogo.terminado) {
                return;
            }

            const palavraNormalizada = palavra.trim().toLowerCase();

            // criar lista do jogador se ainda nao existir
            if (sala.jogo.palavrasDescobertas[userId] === undefined) {
                  sala.jogo.palavrasDescobertas[userId] = [];
            }

            // ja descoberta este jogador
            if (
                sala.jogo.palavrasDescobertas[userId].includes(palavraNormalizada)) {

                socket.emit("wordResult", {
                    success: false,
                    message: "Palavra já descoberta"
                });

                return;
            }

            // palavra válida
            if (
                sala.jogo.palavrasValidas.includes(
                    palavraNormalizada
                )
            ) {

                sala.jogo.palavrasDescobertas[userId].push(palavraNormalizada);

                // iniciar score
                if (sala.jogo.pontuacoes[userId] === undefined) {
                    sala.jogo.pontuacoes[userId] = 0;
                }


                console.log("ANTES:");
                console.log(sala.jogo.pontuacoes[userId]);
                console.log("word length:", palavraNormalizada.length);


                // somar pontos
                sala.jogo.pontuacoes[userId] += palavraNormalizada.length;

                console.log("DEPOIS:");
                console.log(sala.jogo.pontuacoes[userId]);


        /*novo*/const jogador = sala.jogadores.find(j => j.id.toString() === userId.toString());

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

                    // pontos totais
                    pontos: sala.jogo.pontuacoes[userId],

                    // palavras descobertas do jogador
                    totalDescobertas:sala.jogo.palavrasDescobertas[userId].length
                });
                return;
            }

            // inválida
            socket.emit("wordResult", {
                success: false,
                message: "Palavra inválida"/*,
                palavra,
                pontos,
                totalDescobertas*/
            });

        } catch (err) {

            console.error(err);
        }
    });//NOVO


/*
    socket.on("updateScore", async ({ codigoSala, userId, pontos }) => {
        
      const sala = await Sala.findOne({ codigo: codigoSala });

      if (!sala) return;

      const jogador = sala.jogadores.find(j => j.id.toString() === userId.toString());

      if (!jogador) return;

      jogador.pontos = pontos;

      await sala.save();

      io.to(codigoSala).emit("scoreUpdated", {
          userId,
          pontos
      });

      const codigoNormalizado = codigoSala?.trim().toUpperCase();


        io.to(codigoNormalizado).emit(
            "scoreUpdated",
            {
                userId,
                pontos
            }
        );
    });*/

    /*socket.on("updateWords", async ({ codigoSala, userId, palavras }) => {
        console.log("UPDATE WORDS EVENT");

        console.log({
            codigoSala,
            userId,
            palavras
        });

        const sala = await Sala.findOne({ codigo: codigoSala });

        if (!sala) return;

        const jogador = sala.jogadores.find(j => j.id.toString() === userId.toString());

        if (!jogador) return;

        jogador.palavras = palavras;

        await sala.save();

        console.log("PLAYER AFTER UPDATE");
        console.log(jogador);
    });*/

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