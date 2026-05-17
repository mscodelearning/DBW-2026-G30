import mongoose from "mongoose";
import passportLocalMongooseImport from "passport-local-mongoose";


/**
 * schema responsável por armazenar os dados dos utilizadores
 */
const passportLocalMongoose =
  passportLocalMongooseImport.default || passportLocalMongooseImport;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    nickname: {
      type: String,
      required: true,
      trim: true,
    },

    estatisticas: {

      totalPontos: {
        type: Number,
        default: 0
      },

      respostasEncontradas: {
        type: Number,
        default: 0
      },

      respostasErradas: {
        type: Number,
        default: 0
      },

      tempoTotal: {
        type: Number,
        default: 0
      },

    },

    avatar: {
      type: String,
      default: "/symbols/user-icon-2.png"
    }
  },

  { timestamps: true }
);


/**
 * adiciona funcionalidades de autenticação ao schema do utilizador, como hashing de passwords e métodos de login
 */
userSchema.plugin(passportLocalMongoose);


/**
 * modelo MongoDB usado para gerir utilizadores da aplicação
 */
export default mongoose.model("User", userSchema);