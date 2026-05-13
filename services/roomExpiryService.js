import Sala from '../models/sala.js';

export function novaDataExpiracao(minutos = 10) {
    return new Date(Date.now() + minutos * 60 * 1000);
}

export async function refreshRoomExpiry(codigo, minutos = 10) {
    await Sala.updateOne(
        { codigo: codigo.toUpperCase() },
        { $set: { expireAt: novaDataExpiracao(minutos) } }
    );
}