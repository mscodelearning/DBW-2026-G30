
let indexCont = async function (req, res) {
    if (!req.isAuthenticated()) {
        console.log("Acesso nao autorizado.");
        return res.redirect("/login");
    }
}

module.exports = indexCont;