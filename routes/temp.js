import express from "express";
import Sala from "../models/sala.js";

const router = express.Router();

router.get("/debug/reset-default1", async (req, res) => {
  try {
    await Sala.updateOne(
      { codigo: "DEFAULT1" },
      {
        $set: {
          estado: "waiting",
          jogadores: [],
          "jogo.iniciado": false,
          "jogo.palavraMestra": null,
          "jogo.palavrasValidas": [],
          "jogo.inicio": null,
          "jogo.palavrasDescobertas": {},
          "jogo.pontuacoes": {}
        }
      }
    );

    res.send("DEFAULT1 reset done");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resetting room");
  }
});

export default router;