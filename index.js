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


import { carregarDicionario } from "./services/wordService.js";

import multiplayerSocket from "./socket/multiplayerSocket.js";

import { garantirSalasPublicasDefault } from "./services/defaultRoomService.js";

import Sala from "./models/sala.js";

// carrega o dicionario de palavras ao iniciar a aplicacao 
carregarDicionario();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.set("view engine", "ejs"); // Diz ao Express que as views serão renderizadas com EJS.
app.use(express.static(path.join(__dirname, "public"))); // Expõe CSS, JS e imagens da pasta public.
app.use(express.urlencoded({ extended: true })); // Converte dados enviados por formulários em req.body.
app.use(express.json()); // processa pedidos json
app.use(methodOverride("_method")); // Permite usar métodos HTTP diferentes dos padrões (como PUT e DELETE).

// passport variables
import passport from "passport";
import localStrategy from "passport-local";
import session from "express-session";
import user from "./models/userModel.js";


const LocalStrategy = localStrategy.Strategy;

// cria o servidor HTTP e associa o socket.io
const server = http.createServer(app);
const io = new Server(server);

// regista os eventos socket.io do modo multiplayer
multiplayerSocket(io);

// configuracao de sessoes
app.use(
    session({
        secret: "your-secret-key", //usado para encriptacao de dados
        resave: false,
        saveUninitialized: false,
        })
);


app.use(passport.initialize()); // inicializa passport
app.use(passport.session()); // usado para restaurar uma sessao de utilizador



passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser()); // guarda utilizador na sessao
passport.deserializeUser(user.deserializeUser()); // retira um utilizador na sessao


// disponibiliza dados do utilizador autenticado em todas as views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  next();
});


// registo das rotas da aplicacao
app.use("/", homeRoutes);
app.use("/", userRoutes);
app.use("/", gameRoutes);
app.use("/multiplayer", multiplayerRoutes);
app.use("/api/estatisticas", estatisticasRoutes);

// liga a base de dados e garante a existencia das salas publicas predefinidas
mongoose .connect( 
  "mongodb+srv://2003marianas_db_user:mlRRh9PBxq49pWDY@dbw2526.zmknrl1.mongodb.net/?appName=DBW2526&retryWrites=true&w=majority " 
  ) 
  .then(async () => { 
  console.log("Connected to MongoDB"); 
  await garantirSalasPublicasDefault();
  console.log("Salas públicas default carregadas com sucesso");
  const salas = await Sala.find({}, "codigo nome isDefault").lean();
  console.log("Salas na BD:", salas);
  }) 
  .catch((err) => { 
  console.log(err); 
  });

  server.listen(3000, (err) => { 
  if (err) 
  console.error(err); 
  else 
  console.log("Server listening on PORT", 3000); 
}); 