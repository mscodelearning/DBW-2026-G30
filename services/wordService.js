import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import normalizarPalavra from "../utils/normalizarPalavras.js";

// obtem o caminho do ficheiro atual e da respetiva pasta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dicionario = new Set(); // conjunto em memoria com as palavras normalizadas do dicionario

/**
 * carrega o dicionario de palavras a partir do ficheiro wordsList.txt
 * filtrando apenas palavras minusculas , sem hifen e com pelo menos 2 caracteres e
 * as palavras sao normalizadas antes de serem guardadas no set
 */

function carregarDicionario() {
    const filePath = path.join(__dirname, "../dados/wordsList.txt");

    const content = fs.readFileSync(filePath, "utf-8");

    const palavras = content.split("\n");

    for (let palavra of palavras) {
        palavra = palavra.trim();

        if (!palavra) continue;

        if (palavra !== palavra.toLowerCase()) continue;

        if (palavra.length < 2) continue;

        if (palavra.includes("-")) continue;

        const normalizado = normalizarPalavra(palavra);

        dicionario.add(normalizado);
    }

    console.log(`Dicionário carregado: ${dicionario.size} palavras`);
}



/**
 * verifica se uma palavra existe no dicionario carregado 
 * depois a palavra é normalizada antes da comparacao 
 * @param {string} palavra palavra a ser verificada
 * @returns {boolean} retorna true se a palavra existir no dicionario, caso contrario retorna false
 */

function palavraExiste(palavra) {
    const normalizado = normalizarPalavra(palavra);

    return dicionario.has(normalizado);
}

export {
    carregarDicionario,
    dicionario,
    palavraExiste
};

carregarDicionario();

