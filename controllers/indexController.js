
let indexCont = async function (req, res) {
    if (!req.isAuthenticated()) {
        // se nao esta autenticado, vai para o login
        console.log("Acesso nao autorizado.");
        return res.redirect("/login");
    }
    //let livros = await Livro.find({});  falta pequisar:
    //res.render("index", {info: livros}); alterar para adaptar ao nosso 
}

module.exports = indexCont;