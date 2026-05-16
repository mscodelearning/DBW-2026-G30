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
            default: null
        },

        challengeType: {
            type: String,
            enum: ["Não", "Objetivo: nº palavras", "Mín. letras", "Máx. letras"],
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

            avatar: String,

            pontos: {
                type: Number,
                default: 0
            },

            palavras: {
                type: Number,
                default: 0
            },

            erros: {
                type: Number,
                default: 0
            }

        }
    ],

    estado: {
        type: String,
        default: "waiting"
    },

    jogo: {

        iniciado: {
            type: Boolean,
            default: false
        },

        palavraMestra: {
            type: String,
            default: null
        },

        palavrasValidas: {
            type: [String],
            default: []
        },

        inicio: {
            type: Date,
            default: null
        },

        palavrasDescobertas: {
            type: Object,
            default: {}
        },

        pontuacoes: {
            default: {}
        }
    },

    nome: {
        type: String,
        trim: true,
        default: 'Nome da Sala'
    },

    isDefault: {
        type: Boolean,
        default: false
    },

    expireAt: {
        type: Date,
        expires: 0 ,
        /*default: () => new Date(Date.now() + 2 * 60 * 60 * 1000)*/
        //default: () => new Date(Date.now() + 1 * 60 * 1000)
    }

}, {
    timestamps: true
});

const Sala = mongoose.model("Sala", salaSchema);

export default Sala;