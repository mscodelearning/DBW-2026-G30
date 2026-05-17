import Sala from '../models/sala.js';

export function novaDataExpiracao(minutos = 20) {
    return new Date(Date.now() + minutos * 60 * 1000);
}

export async function refreshRoomExpiry(codigo, minutos = 20) {
    await Sala.updateOne(
        { codigo: codigo.toUpperCase() },
        { $set: { expireAt: novaDataExpiracao(minutos) } }
    );
}