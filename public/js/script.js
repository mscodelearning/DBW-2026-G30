'use strict';

/*Caixa de texto do ecra login*/ 
const formAreaLogin = document.getElementById('form-area-login');

const usernameInputLogin = document.createElement('input');
usernameInputLogin.setAttribute('type', 'text');
usernameInputLogin.setAttribute('placeholder', 'Username');
usernameInputLogin.classList.add('login-input');

const passwordInputLogin = document.createElement('input');
passwordInputLogin.setAttribute('type', 'password');
passwordInputLogin.setAttribute('placeholder', 'Password');
passwordInputLogin.classList.add('login-input');

formAreaLogin.appendChild(usernameInputLogin);
formAreaLogin.appendChild(passwordInputLogin);


/*Caixa de texto do ecra signup*/ 
const formAreaSignup = document.getElementById('form-area-signup');

const usernameInputSignup = document.createElement('input');
usernameInputSignup.setAttribute('type', 'text');
usernameInputSignup.setAttribute('placeholder', 'Username');
usernameInputSignup.classList.add('signup-input');

const passwordInputSignup = document.createElement('input');
passwordInpuSignup.setAttribute('type', 'password');
passwordInputSignup.setAttribute('placeholder', 'Password');
passwordInputSignup.classList.add('signup-input');

const nicknameInput = document.createElement('input');
passwordInputSignup.setAttribute('type', 'nickname');
passwordInputSignup.setAttribute('placeholder', 'Nickname');
passwordInputSignup.classList.add('signup-input');


formAreaSignup.appendChild(nicknameInput);
formAreaSignup.appendChild(usernameInputSignup);
formAreaSignup.appendChild(passwordInputSignup);

