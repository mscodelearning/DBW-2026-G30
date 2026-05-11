import express from "express"; // Framework HTTP usado para criar a aplicação web.
import path from "path"; // Ajuda a construir caminhos de ficheiros de forma segura.
import { fileURLToPath } from "url"; // Converte a URL do módulo ES num caminho real do sistema.

import http from 'http';
import { Server } from 'socket.io';

import mongoose from "mongoose";
import methodOverride from "method-override";
import homeRoutes from "./routes/homeRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

import userRoutes from "./routes/userRoute.js";
import estatisticasRoutes from "./routes/estatisticasRoutes.js";
import multiplayerRoutes from "./routes/multiplayerRoutes.js";
import ChatMessage from "./models/chatMessageModel.js";


import { carregarDicionario } from "./services/wordService.js";

import multiplayerSocket from "./socket/multiplayerSocket.js";

carregarDicionario();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Equivalente moderno do __dirname em projetos com ES Modules.

const app = express();


app.set("view engine", "ejs"); // Diz ao Express que as views serão renderizadas com EJS.
app.use(express.static(path.join(__dirname, "public"))); // Expõe CSS, JS e imagens da pasta public.
app.use(express.urlencoded({ extended: true })); // Converte dados enviados por formulários em req.body.
app.use(express.json());
app.use(methodOverride("_method")); // Permite usar métodos HTTP diferentes dos padrões (como PUT e DELETE).

// passport variables
import passport from "passport";
import localStrategy from "passport-local";
import session from "express-session";
import user from "./models/userModel.js";


const LocalStrategy = localStrategy.Strategy;

const server = http.createServer(app);
const io = new Server(server);

multiplayerSocket(io);


app.use(
    session({
        secret: "your-secret-key", //usado para encriptacao de dados
        resave: false,
        saveUninitialized: false,
        })
);


app.use(passport.initialize()); // inicializa passport
app.use(passport.session()); // usado para restaurar uma sesao de utilizador



passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser()); // guarda utilizador na sessao
passport.deserializeUser(user.deserializeUser()); // retira um utilizador na sessao


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  next();
});


/** definir o app.use das rotas aqui */
app.use("/", homeRoutes);
app.use("/", userRoutes);
app.use("/", gameRoutes);
app.use("/multiplayer", multiplayerRoutes);

app.use("/api/estatisticas", estatisticasRoutes);


io.on("connection", function (socket) {
    console.log(`Utilizador ligado: ${socket.id}`);

    socket.on("joinRoom", async function (roomName) {
    try {
      const normalizedRoom = roomName?.trim();

      if (!normalizedRoom) return;

      if (socket.data.currentRoom) {
        socket.leave(socket.data.currentRoom);
      }

      socket.join(normalizedRoom);
      socket.data.currentRoom = normalizedRoom;

      console.log(`Socket ${socket.id} entrou no chat da sala ${normalizedRoom}`);

      socket.emit("roomJoined", {
        sala: normalizedRoom,
        socketID: socket.id,
      });

      const historico = await ChatMessage.find({ salaCodigo: normalizedRoom })
        .sort({ createdAt: 1 })
        .limit(100);

      socket.emit("chatHistory", historico);
    } catch (err) {
      console.log("Erro ao entrar na sala / carregar histórico:", err);
    }
  });

  socket.on("chat", async function (msgData) {
    try {
      const normalizedMessage = msgData?.mensagem?.trim();
      const normalizedRoom = msgData?.sala?.trim();

      if (!normalizedMessage || !normalizedRoom) return;

      const novaMensagem = await ChatMessage.create({
        salaCodigo: normalizedRoom,
        senderId: msgData.senderId,
        senderName: msgData.senderName || "Utilizador",
        senderAvatar: msgData.senderAvatar || "/symbols/Union-user-icon.png",
        mensagem: normalizedMessage,
      });

      const paraCliente = {
        _id: novaMensagem._id,
        senderId: String(novaMensagem.senderId),
        senderName: novaMensagem.senderName,
        senderAvatar: novaMensagem.senderAvatar,
        mensagem: novaMensagem.mensagem,
        sala: normalizedRoom,
        createdAt: novaMensagem.createdAt,
      };

      console.log(`Mensagem emitida para sala ${normalizedRoom}`);

      io.to(normalizedRoom).emit("clientChat", paraCliente);
    } catch (err) {
      console.log("Erro ao guardar/enviar mensagem:", err);
    }
  });

  socket.on("disconnect", function () {
    console.log(`Utilizador desligado: ${socket.id}`);
  });
});


mongoose 
.connect( 
"mongodb+srv://2003marianas_db_user:mlRRh9PBxq49pWDY@dbw2526.zmknrl1.mongodb.net/?appName=DBW2526&retryWrites=true&w=majority " 
) 
.then(() => { 
console.log("Connected to MongoDB"); 
}) 
.catch((err) => { 
console.log(err); 
});


//app.listen(3000, (err) => {
server.listen(3000, (err) => { 
if (err) 
console.error(err); 
else 
console.log("Server listening on PORT", 3000); 
}); 