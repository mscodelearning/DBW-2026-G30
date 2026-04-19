'use strict';


/* Inicio - Validacao dos campos da pagina de alteracao da password */

const form = document.getElementById("formAlterarPassword");
    const nova = document.getElementById("nova");
    const confirmar = document.getElementById("confirmar");
    const erro = document.getElementById("erroPassword");

    form.addEventListener("submit", function(event) {
      erro.textContent = "";

      if (nova.value.length < 6) {
        event.preventDefault();
        erro.textContent = "A nova palavra-passe deve ter pelo menos 6 caracteres.";
        return;
      }

      if (nova.value !== confirmar.value) {
        event.preventDefault();
        erro.textContent = "A nova palavra-passe e a confirmação não coincidem.";
        return;
      }

      // testar sem servidor
      event.preventDefault();
      alert("Palavra-passe alterada com sucesso!");
      /*window.location.href = "perfil.html";*/
      window.location.href = "/perfilPage";
});

/* Fim - Validacao dos campos da pagina de alteracao da password */