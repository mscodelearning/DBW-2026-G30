import express from "express"; // Framework HTTP usado para criar a aplicação web.
import path from "path"; // Ajuda a construir caminhos de ficheiros de forma segura.
import { fileURLToPath } from "url"; // Converte a URL do módulo ES num caminho real do sistema.

import homeRoutes from "./routes/homeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Equivalente moderno do __dirname em projetos com ES Modules.

const app = express();
app.set("view engine", "ejs"); // Diz ao Express que as views serão renderizadas com EJS.
app.use(express.static(path.join(__dirname, "public"))); // Expõe CSS, JS e imagens da pasta public.
app.use(express.urlencoded({ extended: true })); // Converte dados enviados por formulários em req.body.


/** definir o app.use das rotas aqui */
app.use("/", homeRoutes);

app.listen(3000, (err) => { 
if (err) 
console.error(err); 
else 
console.log("Server listening on PORT", 3000); 
}); 