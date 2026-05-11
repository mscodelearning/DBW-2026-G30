import mongoose from "mongoose";

const salaSchema = new mongoose.Schema({

    codigo: {
        type: String,
        required: true,
        unique: true
    },

    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    configuracoes: {

        access: {
            type: String,
            enum: ["Público", "Privado"],
            required: true
        },

        players: {
            type: Number,
            enum: [2, 3, 4],
            required: true
        },

        timer: {
            type: Number,
            default: 0
        },

        challengeType: {
            type: String,
            enum: ["Não", "Objetivo: nº de palavras", "Mín. letras", "Máx. letras"],
            default: "Não"
        },

        challengeValue: {
            type: Number,
            default: 0
        }

    },

    jogadores: [
        {
            id: mongoose.Schema.Types.ObjectId,

            username: String,

            nickname: String,

            avatar: String
            
        }
    ],

    estado: {
        type: String,
        default: "waiting"
    },

    nome: {
        type: String,
        trim: true,
        default: 'Nome da Sala'
    }

}, {
    timestamps: true
});

const Sala = mongoose.model("Sala", salaSchema);

export default Sala;