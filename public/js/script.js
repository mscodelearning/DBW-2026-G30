
'use strict';

const formAreaLogin = document.getElementById("form-area-login");

if (formAreaLogin) {
  const form = formAreaLogin.querySelector("form");
  const usernameInputLogin = form.querySelector('input[name="username"]');
  const passwordInputLogin = form.querySelector('input[name="password"]');

  // valida os campos de login antes de permitir o envio do formulario
  form.addEventListener("submit", (event) => {
    if (!validateUserPassword(usernameInputLogin, passwordInputLogin)) {
      event.preventDefault();
    }
  });
}


let subMenu = document.getElementById("subMenu");

// mostra ou esconde o submenu
function toggleMenu(){
  subMenu.classList.toggle("open-menu");
}

