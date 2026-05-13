import Sala from "../models/sala.js";

/*
export async function carregarSalasPublicas(req, res) {
  try {
    const salasDefault = [
      {
        nome: "Plutao",
        jogadoresAtuais: 3,
        configuracoes: {
          players: 4,
          timer: 1,
          challengeType: "Mín. letras",
          challengeValue: 4
        },
        isDefault: true
      },
      {
        nome: "Saturno",
        jogadoresAtuais: 4,
        configuracoes: {
          players: 4,
          timer: 1,
          challengeType: "Não",
          challengeValue: 0
        },
        isDefault: true
      },
      {
        nome: "Jupiter",
        jogadoresAtuais: 2,
        configuracoes: {
          players: 4,
          timer: 2,
          challengeType: "Mín. letras",
          challengeValue: 3
        },
        isDefault: true
      },
      {
        nome: "Neptuno",
        jogadoresAtuais: 1,
        configuracoes: {
          players: 4,
          timer: 0,
          challengeType: "Mín. letras",
          challengeValue: 5
        },
        isDefault: true
      }
    ];

    const salasDB = await Sala.find({ "configuracoes.access": "Público" }).lean();

    const salasFormatadas = salasDB.map((sala) => ({
      ...sala,
      jogadoresAtuais: sala.jogadores.length,
      isDefault: false
    }));

    const salasPublicas = [...salasDefault, ...salasFormatadas];

    res.render("salasPublicas", { salasPublicas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar salas públicas.");
  }
}

*/

export async function carregarSalasPublicas(req, res) {
  try {
    const salasDB = await Sala.find({ "configuracoes.access": "Público" }).lean();

    const salasPublicas = salasDB.map((sala) => ({
      ...sala,
      jogadoresAtuais: Array.isArray(sala.jogadores) ? sala.jogadores.length : 0,
      isDefault: !!sala.isDefault
    }));

    res.render("salasPublicas", { salasPublicas });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao carregar salas públicas.");
  }
}

