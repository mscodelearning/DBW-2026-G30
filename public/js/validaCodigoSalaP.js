'use strict';

const entrarLink = document.getElementById("entrar-link");
  const inputCodigo = document.getElementById("codigoSala");

  entrarLink.addEventListener("click", function (event) {
    event.preventDefault(); // impede o link de ir para "#"

    const codigo = inputCodigo.value.trim();

    if (!codigo) {
      alert("Introduz um código de sala.");
      return;
    }

    // Exemplo: redirecionar para sala-privada.html com o código na query
    window.location.href = "/salasPrivadas?codigo=" + encodeURIComponent(codigo);
  });