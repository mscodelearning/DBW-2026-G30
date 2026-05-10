import mongoose from "mongoose";

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

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;