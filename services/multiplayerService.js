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
                username: user.username
            }
        ]

    });

    await novaSala.save();

    return novaSala;
}