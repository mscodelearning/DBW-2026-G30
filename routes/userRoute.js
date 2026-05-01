const router = require("express").Router();
const userCont = require("../controllers/userController");
const passport = require("passport");

router.get("/", userCont.userGet);

router.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login"}), // comentario temporario: aqui acho que é se falhar volta de novo para o login
    function (req, res) {
        res.redirect("/"); //comentario temporario: caso contrario vai para a pagina inicial
    }
);

module.exports = router;