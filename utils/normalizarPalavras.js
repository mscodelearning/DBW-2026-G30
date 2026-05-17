
/**
 * funcao que normaliza as palavras convertendo as letras maiusculas 
 * para minusculas e removendo os acentos da palavra
 * @param {string} word - palavra a normalizar
 * @return {string} retorna a palavra normalizada
 */

function normalizarPalavra(word) {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export default normalizarPalavra;