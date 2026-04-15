import express from "express"; // Framework HTTP usado para criar a aplicação web.
import path from "path"; // Ajuda a construir caminhos de ficheiros de forma segura.
import { fileURLToPath } from "url"; // Converte a URL do módulo ES num caminho real do sistema.


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

/** definir o app.use das rotas aqui */
app.use("/", homeRoutes);


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


app.listen(3000, (err) => { 
if (err) 
console.error(err); 
else 
console.log("Server listening on PORT", 3000); 
}); 