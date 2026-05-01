import express from "express"; // Framework HTTP usado para criar a aplicação web.
import path from "path"; // Ajuda a construir caminhos de ficheiros de forma segura.
import { fileURLToPath } from "url"; // Converte a URL do módulo ES num caminho real do sistema.

import http from 'http';
import { Server } from 'socket.io';

import mongoose from "mongoose";
import methodOverride from "method-override";
import homeRoutes from "./routes/homeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Equivalente moderno do __dirname em projetos com ES Modules.

const app = express();



app.set("view engine", "ejs"); // Diz ao Express que as views serão renderizadas com EJS.
app.use(express.static(path.join(__dirname, "public"))); // Expõe CSS, JS e imagens da pasta public.
app.use(express.urlencoded({ extended: true })); // Converte dados enviados por formulários em req.body.

app.use(methodOverride("_method")); // Permite usar métodos HTTP diferentes dos padrões (como PUT e DELETE).

// passport variables
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require("express-session");
const user = require("./models/userModel.js");

const server = http.createServer(app);
const io = new Server(server);


/** definir o app.use das rotas aqui */
app.use("/", homeRoutes);


app.use(
    session({
        secret: "your-secret-key", //usado para encriptacao de dados
        resave: false,
        saveUnitialized: false,
        })
);

app.use(passport.initialize()); // inicializa passport
app.use(passport.session()); // usado para restaurar uma sesao de utilizador

passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser()); // guarda utilizador na sessao
passport.deserializeUseer(user.deserializeUser()); // retira um utilizador na sessao

io.on("connection", function (socket) {
    console.log(`Utilizador ligado: ${socket.id}`);

    socket.on("joinRoom", function (roomName) {
        const normalizedRoom = roomName?.trim();

        if (!normalizedRoom) {
            return;
        }

        // Se o utilizador já estava noutra sala, sai primeiro dessa sala.
        if (socket.data.currentRoom) {
            socket.leave(socket.data.currentRoom);
        }

        socket.join(normalizedRoom);
        socket.data.currentRoom = normalizedRoom;

        socket.emit("roomJoined", {
            sala: normalizedRoom,
            socketID: socket.id,
        });
    });

    socket.on("chat", function (msgData) {
        const normalizedMessage = msgData?.mensagem?.trim();
        const normalizedRoom = msgData?.sala?.trim();

        if (!normalizedMessage || !normalizedRoom) {
            return;
        }

        const paraCliente = {
            socketID: socket.id,
            mensagem: normalizedMessage,
            sala: normalizedRoom,
        };

        // Emitimos apenas para a sala escolhida, para que cada chat fique isolado.
        io.to(normalizedRoom).emit("clientChat", paraCliente);
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