/**
 * verifica se o utilizador está autenticado antes de permitir o acesso à página
 * @param {Object} req Pedido HTTP contendo os dados de autenticação.
 * @param {Object} res Resposta HTTP utilizada para redirecionamento.
 * @returns {Promise<void>} Redireciona o utilizador caso não esteja autenticado.
 */
let indexCont = async function (req, res) {
    if (!req.isAuthenticated()) {
        console.log("Acesso nao autorizado.");
        return res.redirect("/login");
    }
}

module.exports = indexCont;