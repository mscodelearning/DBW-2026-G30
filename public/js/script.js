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


/*Caixa de texto do ecra signin*/ 
const formAreaSignIn = document.getElementById('form-area-signin');

const usernameInputSignIn = document.createElement('input');
usernameInputSignIn.setAttribute('type', 'text');
usernameInputSignIn.setAttribute('placeholder', 'Username');
usernameInputSignIn.classList.add('signIn-input');

const passwordInputSignIn = document.createElement('input');
passwordInpuSignIn.setAttribute('type', 'password');
passwordInputSignIn.setAttribute('placeholder', 'Password');
passwordInputSignIn.classList.add('signIn-input');

const nicknameInput = document.createElement('input');
passwordInputSignIn.setAttribute('type', 'nickname');
passwordInputSignIn.setAttribute('placeholder', 'Nickname');
passwordInputSignIn.classList.add('signIn-input');


formAreaSignIn.appendChild(nicknameInput);
formAreaSignIn.appendChild(usernameInputSignIn);
formAreaSignIn.appendChild(passwordInputSignIn);

