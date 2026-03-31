
'use strict';
console.log("JS loaded");

/*Caixa de texto do ecra login*/ 

/*
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
*/

/*Caixa de texto do ecra signup*/ 
/* 
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');

    const formAreaSignup = document.getElementById('form-area-signup');
    console.log('formAreaSignup:', formAreaSignup);

    const usernameInputSignup = document.createElement('input');
    usernameInputSignup.setAttribute('type', 'text');
    usernameInputSignup.setAttribute('placeholder', 'Username');
    usernameInputSignup.classList.add('signup-input');

    const passwordInputSignup = document.createElement('input');
    passwordInputSignup.setAttribute('type', 'password');
    passwordInputSignup.setAttribute('placeholder', 'Password');
    passwordInputSignup.classList.add('signup-input');

    const nicknameInput = document.createElement('input');
    nicknameInput.setAttribute('type', 'text');
    nicknameInput.setAttribute('placeholder', 'Nickname');
    nicknameInput.classList.add('signup-input');

    formAreaSignup.appendChild(nicknameInput);
    formAreaSignup.appendChild(usernameInputSignup);
    formAreaSignup.appendChild(passwordInputSignup);

    const validateInputs= () => {
        const nickname = nicknameInput.value.trim();
        const username = usernameInputSignup.value.trim();
        const password = passwordInputSignup.value.trim();

        if (!nickname) {
            alert('O campo Nickname é obrigatorio.');
            nicknameInput.focus();
            return false;
        }

        if (!username) {
            alert('O campo Username é obrigatorio.');
            usernameInputSignup.focus();
            return false;
        }

        if (!password || password.length < 6) {
            alert('O campo Password é obrigatorio e deve ter pelo menos 6 caracteres.');
            return false;
        }

        return true;
    }

    const signupBtn = document.getElementById('signup-link');

    signupBtn.addEventListener('click', function(event) {
        
        event.preventDefault();

        if (validateInputs()) {
            window.location.href = signupBtn.getAttribute('href');
        }

    });
});*/













/*novo codigoooooooooooooooooooooooooooooooooooooo com o pop-up na web*/


document.addEventListener("DOMContentLoaded", () => {

const validateUserPassword = (usernameInput, passwordInput) => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username) {
    alert('O campo Username é obrigatório.');
    usernameInput.focus();
    return false;
  }

  if (!password || password.length < 6) {
    alert('O campo Password é obrigatório e deve ter pelo menos 6 caracteres.');
    passwordInput.focus();
    return false;
  }

  return true;
};


const validateSignupInputs = (nicknameInput, usernameInput, passwordInput) => {
  const nickname = nicknameInput.value.trim();

  if (!nickname) {
    alert('O campo Nickname é obrigatório.');
    nicknameInput.focus();
    return false;
  }

  return validateUserPassword(usernameInput, passwordInput);
};


/* LOGIN (página que tem #form-area-login) */

const formAreaLogin = document.getElementById('form-area-login');

if (formAreaLogin) {
  const usernameInputLogin = document.createElement('input');
  usernameInputLogin.type = 'text';
  usernameInputLogin.placeholder = 'Username';
  usernameInputLogin.classList.add('login-input');

  const passwordInputLogin = document.createElement('input');
  passwordInputLogin.type = 'password';
  passwordInputLogin.placeholder = 'Password';
  passwordInputLogin.classList.add('login-input');

  formAreaLogin.appendChild(usernameInputLogin);
  formAreaLogin.appendChild(passwordInputLogin);

  const loginBtn = document.getElementById('login-link');

  if (loginBtn) {
    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();

      if (validateUserPassword(usernameInputLogin, passwordInputLogin)) {
        window.location.href = loginBtn.getAttribute('href');
      }
    });
  }
}
});

/* SIGNUP (página que tem #form-area-signup) */

document.addEventListener('DOMContentLoaded', () => {
  const formAreaSignup = document.getElementById('form-area-signup');

  if (!formAreaSignup) return;

  const nicknameInput = document.createElement('input');
  nicknameInput.type = 'text';
  nicknameInput.placeholder = 'Nickname';
  nicknameInput.classList.add('caixa-texto','signup-input');

  const usernameInputSignup = document.createElement('input');
  usernameInputSignup.type = 'text';
  usernameInputSignup.placeholder = 'Username';
  usernameInputSignup.classList.add('caixa-texto', 'signup-input');

  const passwordInputSignup = document.createElement('input');
  passwordInputSignup.type = 'password';
  passwordInputSignup.placeholder = 'Password';
  passwordInputSignup.classList.add('caixa-texto', 'signup-input');

  formAreaSignup.appendChild(nicknameInput);
  formAreaSignup.appendChild(usernameInputSignup);
  formAreaSignup.appendChild(passwordInputSignup);

  const signupBtn = document.getElementById('signup-link');

  if (signupBtn) {
    signupBtn.addEventListener('click', (event) => {
      event.preventDefault();

      if (validateSignupInputs(nicknameInput, usernameInputSignup, passwordInputSignup)) {
        window.location.href = signupBtn.getAttribute('href');
      }
    });
  }
});



/*Inicio - codigo do pop up para colocar/alterar imagem*/

const texto = document.getElementById("texto-altera-imagem");
const popup = document.getElementById("pop-up");
const conteudo = document.querySelector(".conteudo-popup");

texto.addEventListener("click", () => {
  popup.style.display = "flex";
});

popup.addEventListener("click", (e) => {
  if (e.target === popup){ //clica no overlay, ou seja, fora do popup
  popup.style.display = "none";
  }
});

/*Fim - codigo do pop up para colocar/alterar imagem*/



/* Inicio - codigo do drag and drop imagem */

document.addEventListener("DOMContentLoaded", () => {

const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");

const uploadText = document.querySelector("#img-view .upload-text");
const btnRemover = document.getElementById("btn-remover");
const btnAplicar = document.getElementById("btn-aplicar");
const perfilImg = document.getElementById("perfil-img");

const defaultPerfilSrc = perfilImg.src;

let currentImageUrl = null; // guarda o url do preview

inputFile.addEventListener("change", uploadImage);

function uploadImage(){

  const file = inputFile.files[0];
  if (!file)return;
  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
  }

  currentImageUrl = URL.createObjectURL(file);
  imageView.style.backgroundImage = `url(${currentImageUrl})`
  imageView.style.border = 0;
  /*imageView.innerHTML = "";*/

  if (uploadText) {
    uploadText.style.display = "none";
  }

}

dropArea.addEventListener("dragover", function(e) {
  e.preventDefault();
});

dropArea.addEventListener("drop", function(e) {
  e.preventDefault();
  inputFile.files = e.dataTransfer.files;
  uploadImage();
});

// Botao remover
btnRemover.addEventListener("click", () => {
  inputFile.value = ""; // limpa o input
  imageView.style.backgroundImage = "none"; // limpa o background
  imageView.style.border = "2px dashed #81C96D";

  if (uploadText) {
    uploadText.style.display = "block";
  }

  perfilImg.src = defaultPerfilSrc;

  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
  }

    currentImageUrl = null;
});


// Botao Aplicar imagem

btnAplicar.addEventListener("click", () => {
  if (!currentImageUrl) return;
  perfilImg.src = currentImageUrl;
  document.getElementById("pop-up").style.display = "none";
})

});

/* Fim - codigo do drag and drop imagem */





/*inicio - selecao do modo de jogo para o singleplayer*/

document.addEventListener("DOMContentLoaded", () => {
  const timerOptions = document.querySelectorAll("#timer-options .item");
  const challengeOptions = document.querySelectorAll("#challenge-options .item");
  const startButton = document.getElementById("start-game");

  let selectedTimer = null;
  let selectedChallenge = null;

  function updateButton() {
    startButton.disabled = !(selectedTimer && selectedChallenge);
  }

  function selectOne(group, clicked, type) {
    group.forEach(item => item.classList.remove("selected"));
    clicked.classList.add("selected");

    if (type === "timer") selectedTimer = clicked.textContent.trim();
    if (type === "challenge") selectedChallenge = clicked.textContent.trim();

    updateButton();
  }

  timerOptions.forEach(item => {
    item.addEventListener("click", () => selectOne(timerOptions, item, "timer"));
  });

  challengeOptions.forEach(item => {
    item.addEventListener("click", () => selectOne(challengeOptions, item, "challenge"));
  });
});

/*fim - selecao do modo de jogo para o singleplayer*/
