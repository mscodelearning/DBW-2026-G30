import mongoose from "mongoose";

/**
 * schema responsável por armazenar mensagens enviadas no chat das salas multiplayer.
 */
const chatMessageSchema = new mongoose.Schema(
  {
    salaCodigo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderAvatar: {
      type: String,
      default: "/symbols/Union-user-icon.png",
    },
    mensagem: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

/**
 * modelo MongoDB usado para gerir mensagens de chat
 */
const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;