import Sala from "../models/sala.js";

const socketsSalas = new Map();
const disconnectTimers = new Map();


function isHost(sala, userId) {
    return sala.host.toString() === userId.toString();
}

export default function multiplayerSocket(io) {

    io.on("connection", (socket) => {

        /*console.log("Novo socket:", socket.id);*/

        /* jogador entra numa sala socket*/
        /*socket.on("joinRoom", async (codigoSala) => {*/

        socket.on("joinMultiplayerRoom", async ({ codigoSala, userId }) => {
            try {
                socket.join(codigoSala);
                socketsSalas.set(socket.id, { codigoSala, userId});

                const pendingKey =`${codigoSala}-${userId}`;

                if (disconnectTimers.has(pendingKey)) {
                    clearTimeout(disconnectTimers.get(pendingKey));
                    disconnectTimers.delete(pendingKey);
                    console.log(`Reconexão detectada para ${userId}`);
                }
                console.log(`Socket entrou na sala ${codigoSala}`);
                const sala = await Sala.findOne({
                    codigo: codigoSala
                });

                if (!sala) { return; }

                /* enviar lista atualizada para todos na sala*/
                io.to(codigoSala).emit(
                    "playersUpdated",
                    sala.jogadores
                );

            } catch (err) {
                console.error(err);
            }

        });

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
                                dados => dados.codigoSala === codigoSala && dados.userId === userId );
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
        });

        socket.on("leaveRoom", async (codigoSala) => {
            try {
                socket.leave(codigoSala);
                const sala = await Sala.findOne({
                    codigo: codigoSala
                });

                if (!sala) {
                    return;
                }

                io.to(codigoSala).emit(
                    "playersUpdated",
                    sala.jogadores
                );

            } catch (err) {
                console.error(err);
            }
        });

        socket.on(
            "startGame",
            async ({ codigoSala, userId }) => {

                try {

                    const sala = await Sala.findOne({ codigo: codigoSala });

                    if (!sala) { return; }

                    if (sala.estado === "playing") {

                        console.log(
                            `Jogo em andamento. Não remover ${userId}`
                        );

                        disconnectTimers.delete(pendingKey);

                        return;
                    }

                    // only host
                    if (!isHost(sala, userId)) {

                        socket.emit(
                            "roomError",
                            "Apenas o host pode iniciar o jogo"
                        );

                        return;
                    }

                    sala.estado = "playing";

                    sala.jogo.iniciado = true;

                    sala.jogo.inicio = new Date();

                    await sala.save();

                    io.to(codigoSala).emit(
                        "gameStarted",
                        {
                            codigoSala,
                            configuracoes: sala.configuracoes,
                            jogadores: sala.jogadores
                        }
                    );

                } catch (err) {
                    console.error(err);
                }
            }
        );

        socket.on("updateScore", ({ codigoSala, userId, pontos }) => {
            io.to(codigoSala).emit(
                "scoreUpdated",
                {
                    userId,
                    pontos
                }
            );
        });

    });
}