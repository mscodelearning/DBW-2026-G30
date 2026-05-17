import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dicionario } from "./wordService.js";
import normalizarPalavra from "../utils/normalizarPalavras.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// lista de palavras mestra carregadas do ficheiro JSON
const palavrasMestras = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "../dados/palavrasMestras.json"),
        "utf-8"
    )
);

/**
 * seleciona aleatoriamente uma palavra mestra da lista carregada
 * @returns {string} palavra mestra escolhida aleatoriamente
 */

function getRandomPalavraMestra() {
    const index = Math.floor(Math.random() * palavrasMestras.length);

    return palavrasMestras[index];
}

/**
 * gera lista de palavras validas que podem ser condtruidas a partir 
 * de uma palavra mestra 
 * @param {string} palavraMestra palavra base usada para gerar combinacoes  
 * @returns lista de palavras validas
 */

function gerarPalavrasValidas(palavraMestra) {
    const palavrasValidas = [];

    for (const word of dicionario) {

        if (podeConstruirPalavra(word, palavraMestra)) {
            palavrasValidas.push(word);
        }
    }
    return palavrasValidas;
}

/**
 * veirifica se uma palavra pode ser contruida a apartir das letras
 * de uma palavra mestra respeitando a ordem dos caracteres e a 
 * palavra testada nao pode ser igual a palavra mestra
 * @param {string} word palavra a validar 
 * @param {string} palavraMestra palavra mestra usada como base
 * @returns {boolean} retorna true se a palavra puder ser contruida caso contrario retorna false
 */

function podeConstruirPalavra(word, palavraMestra) {

    word = normalizarPalavra(word);
    palavraMestra = normalizarPalavra(palavraMestra);

    if (word === palavraMestra) {
        return false;
    }

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