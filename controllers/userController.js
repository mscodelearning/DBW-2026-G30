import User from "../models/userModel.js";

/**
 * renderiza a página de signup
 * @param {Object} req pedido HTTP recebido pelo servidor
 * @param {Object} res resposta HTTP utilizada para renderizar a página
 * @returns {void} 
 */
export const getSignup = (req, res) => {
  //renderiza a página de signup.
  res.render("signupPage", { error: null });
};



/**
 * regista um novo user após validar os dados enviados
 * @param {Object} req pedido HTTP contendo os dados do utilizador
 * @param {Object} res resposta HTTP enviada ao cliente
 * @returns {Promise<void>}
 */
export const postSignup = async (req, res) => {
  try {
    const { username, nickname, password } = req.body; //dados enviados pelo formulário

    if (!username || !nickname || !password) {
      return res.render("signupPage", {
        error: "Preenche todos os campos.",
      });
    }

    const newUser = new User({ username, nickname });
    await User.register(newUser, password);

    // redireciona para login ou renderiza erros.
    res.redirect("/login");
  } catch (err) {
    res.render("signupPage", {
      error: "Username já existe! \n Tente novamente.",
    });
  }
};


/**
 * renderiza a página de login
 * @param {Object} req pedido http recebido pelo servidor
 * @param {Object} res resposta http utilizada para renderizar a página.
 * @returns {void} 
 */
export const getLogin = (req, res) => {
  //renderiza a página de login.
  res.render("loginPage", { error: null });
};



/**
 * middleware que verifica se o utilizador está autenticado
 * @param {Object} req pedido HTTP contendo os dados de autenticação.
 * @param {Object} res resposta HTTP utilizada para redirecionamento.
 * @param {Object} next função middleware seguinte.
 * @returns 
 */
export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
