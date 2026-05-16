
'use strict';

const formAreaLogin = document.getElementById("form-area-login");

if (formAreaLogin) {
  const form = formAreaLogin.querySelector("form");
  const usernameInputLogin = form.querySelector('input[name="username"]');
  const passwordInputLogin = form.querySelector('input[name="password"]');

  form.addEventListener("submit", (event) => {
    if (!validateUserPassword(usernameInputLogin, passwordInputLogin)) {
      event.preventDefault();
    }
  });
}


let subMenu = document.getElementById("subMenu");

function toggleMenu(){
  subMenu.classList.toggle("open-menu");
}

