import Sala from "../models/sala.js";
import { refreshRoomExpiry, novaDataExpiracao } from "../services/roomExpiryService.js";


/**
 * verifica se uma sala nao for default deve ser apagada
 * @param {Object} sala - representa o documento da sala 
 * @returns {boolean} retorna true se a sala nao for padrao(DEFAULt) e nao tiver jogadores caso contrario false
 */

function salaDeveSerApagada(sala) {
  return !sala.isDefault && sala.jogadores.length === 0;
}

 /**
  * gera um codigo aleatorio de 6 caracteres para identificar uma sala 
  * @returns {string} retorna um codigo associada a sala 
  */
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

/**
 * repoe o estado do jogo de uma sala para o estadp iniical de espera
 * @param {*} sala - documento da sala a atualizar
 */

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


/**
 * cria uma nova sala com base nas configuracoes selecionadas pelo o user 
 * e adiciona o user que criou a sala à sala nova
 * @param {Objeto} dadosSala representa as configuracoes da sala 
 * @param {*} user utilizador que cria a sala 
 * @returns {Promise<Object>} Promessa resolvida com a sala nova criada
 */

export async function criarNovaSala(dadosSala, user) {

    const {
        access, // tipo de acesso a sala
        players, // numero maximo de players
        timer, // duracao do jogo em segundos 
        challengeType, // tipo de desafio configurado
        challengeValue // valor associado ao desafio
    } = dadosSala;

    if (!access) {
        throw new Error("Tipo de sala inválido"); // lanca erro se os dados da sala forem invalidos
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


/**
 * adiciona um utilizador a uma sala existente, desde que a sala exista 
 * que esteje em espera e com vagas disponiveiss
 * @param {String} codigo codigo da sala
 * @param {Object} user utilizador que pretende entrar 
 * @returns {Promessa<Object>} Promessa resolvida com a sala atualizada
 */

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

  if (!sala) 
    throw new Error("Sala não encontrada"); // cria e lanca erro se a sala nao existir
  if (sala.estado !== "waiting") 
    throw new Error("A sala já começou"); // cria e lanca erro se a sala ja comecou

  const jogadorJaExiste = sala.jogadores.some(
    j => j.id.toString() === user._id.toString()
  );

  if (jogadorJaExiste) {
    await Sala.updateOne(
      { _id: sala._id },
      { $set: { expireAt: sala.isDefault ? null : novaDataExpiracao(20) } }
    );
    return await Sala.findById(sala._id);
  }

  if (sala.jogadores.length >= sala.configuracoes.players) {
    throw new Error("Sala cheia"); // cria e lanca erro se a sala ja estiver cheia 
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
        expireAt: sala.isDefault ? null : novaDataExpiracao(20)
      }
    }
  );

  return await Sala.findById(sala._id);
}

/**
 * remove um utilizador de uma sala e atualiza o estado da sala apos a saida 
 * se a sala ficar vazia, o estado do jogo é reiniciado
 * @param {string} codigo codigo da sala 
 * @param {string} userId ID do utilizador a remover 
 * @returns {Primise<Object>} Promessa resolvida com a sala atualizada
 */

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
      sala.expireAt = novaDataExpiracao(20);
    }

    await sala.save();
    return sala;
  }

  sala.expireAt = sala.isDefault ? null : novaDataExpiracao(20);
  await sala.save();
  return sala;
}