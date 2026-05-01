import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import normalizarPalavra from "../utils/normalizarPalavras.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dictionary = new Set();

function loadDictionary() {
    const filePath = path.join(__dirname, "../dados/wordsList.txt");

    const content = fs.readFileSync(filePath, "utf-8");

    const words = content.split("\n");

    for (let word of words) {
        word = word.trim();

        if (!word) continue;

        if (word !== word.toLowerCase()) continue;

        if (word.includes("-")) continue;

        const normalizado = normalizarPalavra(word);

        dictionary.add(normalizado);
    }

    console.log(`Dicionário carregado: ${dictionary.size} palavras`);
}

function wordExists(word) {
    const normalizado = normalizarPalavra(word);

    return dictionary.has(normalizado);
}

export {
    loadDictionary,
    dictionary,
    wordExists
};