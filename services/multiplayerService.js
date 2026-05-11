import Sala from "../models/sala.js";

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

export async function criarNovaSala(dadosSala, user) {

    const {
        access,
        players,
        timer,
        challengeType,
        challengeValue
    } = dadosSala;

    // validações

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

    const sala = await Sala.findOne({
        codigo: codigo.toUpperCase()
    });

    // sala nao existe
    if (!sala) {
        throw new Error("Sala não encontrada");
    }

    // jogo ja começou
    if (sala.estado !== "waiting") {
        throw new Error("A sala já começou");
    }

    // verificar se jogador ja esta na sala
    const jogadorJaExiste = sala.jogadores.some(
        jogador => jogador.id.toString() === user._id.toString()
    );

    // evita duplicados
    if (jogadorJaExiste) {
        return sala;
    }

    // verificar limite jogadores
    if (sala.jogadores.length >= sala.configuracoes.players) {
        throw new Error("Sala cheia");
    }

    // adicionar jogador
    sala.jogadores.push({
        id: user._id,
        username: user.username,
        nickname: user.nickname || user.username
    });

    await sala.save();

    return sala;
}

export async function sairDaSala(codigo, userId) {

    const sala = await Sala.findOne({
        codigo
    });

    if (!sala) {
        throw new Error("Sala não encontrada");
    }

    sala.jogadores =
        sala.jogadores.filter(
            jogador =>
                jogador.id.toString() !== userId.toString()
        );

    /* se host sair e sala ficar vazia apagar sala*/
    if (sala.jogadores.length === 0) {

        await Sala.deleteOne({
            _id: sala._id
        });

        return null;
    }

    await sala.save();

    return sala;
}