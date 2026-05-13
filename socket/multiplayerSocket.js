import Sala from "../models/sala.js";
import { refreshRoomExpiry, novaDataExpiracao } from "../services/roomExpiryService.js";

const socketsSalas = new Map();
const disconnectTimers = new Map();

export default function multiplayerSocket(io) {

    io.on("connection", (socket) => {

        /*console.log("Novo socket:", socket.id);*/

        /* jogador entra numa sala socket*/
        /*socket.on("joinRoom", async (codigoSala) => {*/
        socket.on("joinMultiplayerRoom", async ({ codigoSala, userId }) => {
            try {
                socket.join(codigoSala);
                socketsSalas.set(socket.id, { codigoSala, userId});
////////////////////////////////////////////////////
                // carrega sala para dedpois definir a condicao the expiryDate/time
                const sala = await Sala.findOne({ condigo: codigoSala });
                if (!sala) {
                    console.warn(`Sala ${codigoSala} não encontrada ao entar`);
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

                /* enviar lista atualizada para todos na sala*/
                io.to(codigoSala).emit( "playersUpdated", sala.jogadores);

            } catch (err) {
                console.error(err);
            }

        });

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
        } return;

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