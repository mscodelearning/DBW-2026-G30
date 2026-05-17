import Sala from '../models/sala.js';


/**
 * gera uma nova data de expiracao com base no numero de minudos definido
 * @param {number} minutos numero de minutos a adicionar a data atual da sala min=20 
 * @returns {Date} retorna a data de expiracao calculada
 */

export function novaDataExpiracao(minutos = 20) {
    return new Date(Date.now() + minutos * 60 * 1000);
}

/**
 * atualiza a data de expiracao de uma sala
 * @param {string} codigo codigo da sala
 * @param {number} minutos numero de minutos a adicionar a data atual da sala min=20 
 * @return {Promise<void>} apos a atualizacao da sala a promessa fica e depois termina sem devolver dados 
 */

export async function refreshRoomExpiry(codigo, minutos = 20) {
    await Sala.updateOne(
        { codigo: codigo.toUpperCase() },
        { $set: { expireAt: novaDataExpiracao(minutos) } }
    );
}