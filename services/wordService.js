import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import normalizarPalavra from "../utils/normalizarPalavras.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dicionario = new Set();

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

console.log("com hifen:", palavraExiste("guarda-chuva"));
console.log("acronimo:", palavraExiste("GNR"));
console.log("acentos:", palavraExiste("rápido"));
console.log("acentos:", palavraExiste("rapido"));
console.log("random:", palavraExiste("ines"));

