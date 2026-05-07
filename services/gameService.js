import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dicionario } from "./wordService.js";
import normalizarPalavra from "../utils/normalizarPalavras.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const palavrasMestras = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../dados/palavrasMestras.json"),
        "utf-8"
    )
);

function getRandomPalavraMestra() {
    const index = Math.floor(Math.random() * palavrasMestras.length);

    return palavrasMestras[index];
}


function gerarPalavrasValidas(palavraMestra) {
    const palavrasValidas = [];

    for (const word of dicionario) {

        if (podeConstruirPalavra(word, palavraMestra)) {
            palavrasValidas.push(word);
        }
    }
    return palavrasValidas;
}


function podeConstruirPalavra(word, palavraMestra) {

    word = normalizarPalavra(word);
    palavraMestra = normalizarPalavra(palavraMestra);

    let wordIndex = 0;
    let mestraIndex = 0;

    while (
        wordIndex < word.length &&
        mestraIndex < palavraMestra.length
    ) {

        if (word[wordIndex] === palavraMestra[mestraIndex]) {
            wordIndex++;
        }

        mestraIndex++;
    }

    return wordIndex === word.length;
}

export {
    getRandomPalavraMestra,
    gerarPalavrasValidas,
    podeConstruirPalavra
};