import Sala from "../models/sala.js";
import { refreshRoomExpiry, novaDataExpiracao } from "../services/roomExpiryService.js";

function salaDeveSerApagada(sala) {
  return !sala.isDefault && sala.jogadores.length === 0;
}

function gerarCodigoSala() {

    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let codigo = "";

    for (let i = 0; i < 6; i++) {

        codigo += caracteres.charAt(
            Math.floor(Math.random() * caracteres.length)
        );

    }

    return codigo;
}


function resetEstadoJogo(sala) {
  sala.estado = "waiting";
  sala.jogo = {
    iniciado: false,
    palavraMestra: null,
    palavrasValidas: [],
    inicio: null,
    palavrasDescobertas: {},
    pontuacoes: {}
  };
}

export async function criarNovaSala(dadosSala, user) {

    const {
        access,
        players,
        timer,
        challengeType,
        challengeValue
    } = dadosSala;

    if (!access) {
        throw new Error("Tipo de sala inválido");
    }

    if (![2, 3, 4].includes(players)) {
        throw new Error("Número de jogadores inválido");
    }

    if (timer === undefined || timer === null) {
        throw new Error("Timer inválido");
    }

    if (!challengeType) {
        throw new Error("Tipo de desafio inválido");
    }

    if (challengeType !== "Não" && !challengeValue) {
        throw new Error("Desafio inválido: é necessário definir um valor");
    }


    let codigo;

    let codigoExiste = true;

    while (codigoExiste) {

        codigo = gerarCodigoSala();

        const salaExistente = await Sala.findOne({ codigo });

        if (!salaExistente) {
            codigoExiste = false;
        }

    }

    const novaSala = new Sala({

        codigo,

        host: user._id,

        expireAt: novaDataExpiracao(10),

        configuracoes: {
            access,
            players,
            timer,
            challengeType,
            challengeValue
        },

        jogadores: [
            {
                id: user._id,
                username: user.username,
                nickname: user.nickname || user.username,
                avatar: user.avatar
            }
        ]

    });

    await novaSala.save();

    return novaSala;
}

export async function entrarNaSala(codigo, user) {
  const codigoNormalizado = codigo.toUpperCase();

     console.log("ENTRAR SALA pedido:", {
    codigoOriginal: codigo,
    codigoNormalizado,
    userId: user._id.toString(),
    username: user.username
  });

  const sala = await Sala.findOne({ codigo: codigoNormalizado });
  
  console.log("ENTRAR SALA resultado:", {
    encontrada: !!sala,
    codigoNormalizado
  });

  if (!sala) throw new Error("Sala não encontrada");
  if (sala.estado !== "waiting") throw new Error("A sala já começou");

  const jogadorJaExiste = sala.jogadores.some(
    j => j.id.toString() === user._id.toString()
  );

  if (jogadorJaExiste) {
    await Sala.updateOne(
      { _id: sala._id },
      { $set: { expireAt: sala.isDefault ? null : novaDataExpiracao(10) } }
    );
    return await Sala.findById(sala._id);
  }

  if (sala.jogadores.length >= sala.configuracoes.players) {
    throw new Error("Sala cheia");
  }

  await Sala.updateOne(
    { _id: sala._id },
    {
      $push: {
        jogadores: {
          id: user._id,
          username: user.username,
          nickname: user.nickname || user.username,
          avatar: user.avatar
        }
      },
      $set: {
        expireAt: sala.isDefault ? null : novaDataExpiracao(10)
      }
    }
  );

  return await Sala.findById(sala._id);
}

export async function sairDaSala(codigo, userId) {
  const sala = await Sala.findOne({ codigo });

  if (!sala) {
    throw new Error("Sala não encontrada");
  }

  sala.jogadores = sala.jogadores.filter(
    j => j.id.toString() !== userId.toString()
  );

  if (sala.jogadores.length === 0) {
    resetEstadoJogo(sala);

    if (sala.isDefault) {
      sala.expireAt = null;
    } else {
      sala.expireAt = novaDataExpiracao(10);
    }

    await sala.save();
    return sala;
  }

  sala.expireAt = sala.isDefault ? null : novaDataExpiracao(10);
  await sala.save();
  return sala;
}