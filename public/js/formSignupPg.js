'use strict'

document.addEventListener("DOMContentLoaded", () => {
  const formAreaSignup = document.getElementById("form-area-signup");
  if (!formAreaSignup) return;

  const form = formAreaSignup.querySelector("form");
  const nicknameInput = form.querySelector('input[name="nickname"]');
  const usernameInput = form.querySelector('input[name="username"]');
  const passwordInput = form.querySelector('input[name="password"]');

  const validateUserPassword = (usernameInput, passwordInput) => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
      alert("O campo Username é obrigatório.");
      usernameInput.focus();
      return false;
    }

    if (!password || password.length < 6) {
      alert("O campo Password é obrigatório e deve ter pelo menos 6 caracteres.");
      passwordInput.focus();
      return false;
    }

    return true;
  };

  const validateSignupInputs = (nicknameInput, usernameInput, passwordInput) => {
    const nickname = nicknameInput.value.trim();

    if (!nickname) {
      alert("O campo Nickname é obrigatório.");
      nicknameInput.focus();
      return false;
    }

    return validateUserPassword(usernameInput, passwordInput);
  };

  form.addEventListener("submit", (event) => {
    if (!validateSignupInputs(nicknameInput, usernameInput, passwordInput)) {
      event.preventDefault();
    }
  });
});