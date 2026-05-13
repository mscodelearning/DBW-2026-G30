import Sala from "../models/sala.js";

export async function garantirSalasPublicasDefault() {
  const defaults = [
    {
      nome: "Plutao",
      codigo: "DEFAULT1",
      host: "000000000000000000000001",
      configuracoes: {
        access: "Público",
        players: 4,
        timer: 1,
        challengeType: "Mín. letras",
        challengeValue: 4
      },
      jogadores: [],
      estado: "waiting",
      isDefault: true
    },
    
    {
      nome: "Neptuno",
      codigo: "DEFAULT2",
      host: "000000000000000000000001",
      configuracoes: {
        access: "Público",
        players: 4,
        timer: 1,
        challengeType: "Não",
        challengeValue: 0
      },
      jogadores: [],
      estado: "waiting",
      isDefault: true
    },
    {
      nome: "Jupiter",
      codigo: "DEFAULT3",
      host: "000000000000000000000001",
      configuracoes: {
        access: "Público",
        players: 4,
        timer: 2,
        challengeType: "Mín. letras",
        challengeValue: 3
      },
      jogadores: [],
      estado: "waiting",
      isDefault: true
    },
    {
      nome: "Saturno",
      codigo: "DEFAULT4",
      host: "000000000000000000000001",
      configuracoes: {
        access: "Público",
        players: 4,
        timer: 0,
        challengeType: "Mín. letras",
        challengeValue: 5
      },
      jogadores: [],
      estado: "waiting",
      isDefault: true
    }
  ];

  /*
  for (const salaData of defaults) {
    const existe = await Sala.findOne({ codigo: salaData.codigo });
    if (!existe) {
      await Sala.create(salaData);
    }
  }*/

  /////////////////////////////////////////////
  for (const salaData of defaults) {
  const existe = await Sala.findOne({ codigo: salaData.codigo });
  if (!existe) {
    await Sala.create(salaData);
    console.log(`Sala default criada: ${salaData.codigo}`);
  } else {
    console.log(`Sala default já existe: ${salaData.codigo}`);
  }
}

  //////////////////////////////////////////////



}