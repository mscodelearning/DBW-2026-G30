
'use strict';


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

/* SIGNUP (página que tem #form-area-signup) */

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


document.addEventListener("DOMContentLoaded", () => {

/*Inicio - codigo do pop up para colocar/alterar imagem*/

const texto = document.getElementById("texto-altera-imagem");
const popup = document.getElementById("pop-up");


if (texto && popup) {
        texto.addEventListener("click", () => 
          popup.style.display = "flex");
        popup.addEventListener("click", (e) => {
            if (e.target === popup) popup.style.display = "none";
        });
}

/*Fim - codigo do pop up para colocar/alterar imagem*/


/* Inicio - codigo do drag and drop imagem */

const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");

const uploadText = document.querySelector("#img-view .upload-text");
const btnRemover = document.getElementById("btn-remover");
const btnAplicar = document.getElementById("btn-aplicar");
const perfilImg = document.getElementById("perfil-img");

if (!inputFile || !imageView || !perfilImg) {
        console.error("Elementos obrigatórios faltando!");
        return;
    }


const defaultPerfilSrc = perfilImg.src;
let currentImageUrl = null; // guarda o url do preview

/*inputFile.addEventListener("change", uploadImage);*/

function uploadImage(){

  const file = inputFile.files[0];
  if (!file)return;
  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
  }

  currentImageUrl = URL.createObjectURL(file);
  imageView.style.backgroundImage = `url(${currentImageUrl})`
  imageView.style.border = 0;
 

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
  const customInput = document.getElementById("custom-timer");
  const timerOptions = document.querySelectorAll("#timer-options .item");
  const challengeOptions = document.querySelectorAll("#challenge-options .item");
  const startButton = document.getElementById("start-game");
  const customNum = document.getElementById("custom-num");
  const customMin = document.getElementById("custom-min");
  const customMax = document.getElementById("custom-max");

  let selectedTimer = null;
  let selectedChallenge = null;

  customInput.addEventListener("input", () => {
    if (customInput.value.trim() !== "") {
      selectedTimer = customInput.value;
    } else {
      selectedTimer = null;
    }
    updateButton();
  });

  customNum.addEventListener("input", () => {
    if (customNum.value.trim() !== "") {
      selectedChallenge = customNum.value;
    } else {
      selectedChallenge = null;
    }
    updateButton();
});

  customMin.addEventListener("input", () => {
    if (customMin.value.trim() !== "") {
      selectedChallenge = customMin.value;
    } else {
      selectedChallenge = null;
    }
    updateButton();
});

  customMax.addEventListener("input", () => {
    if (customMax.value.trim() !== "") {
      selectedChallenge = customMax.value;
    } else {
      selectedChallenge = null;
    }
    updateButton();
});


  function updateButton() {
    startButton.disabled = !(selectedTimer && selectedChallenge);
  }

function selectOne(group, clicked, type) {
  group.forEach(item => item.classList.remove("selected"));
  clicked.classList.add("selected");

  if (type === "timer") {
    const value = clicked.textContent.trim();



    if (value === "Personalizado") {
      customInput.style.display = "block";
      selectedTimer = null; // wait for user input
    } else {
      customInput.style.display = "none";
      selectedTimer = value;
    }
  }

    if (type === "challenge") {
    const value = clicked.textContent.trim();

    // hide all inputs first
    customNum.style.display = "none";
    customMin.style.display = "none";
    customMax.style.display = "none";

    selectedChallenge = value;

    if (value === "Objetivo: nº de palavras") {
      customNum.style.display = "block";
      selectedChallenge = null;
    }

    if (value === "Mín. letras") {
      customMin.style.display = "block";
      selectedChallenge = null;
    }

    if (value === "Máx. letras") {
      customMax.style.display = "block";
      selectedChallenge = null;
    }
  }

  updateButton();
}

  timerOptions.forEach(item => {
    item.addEventListener("click", () => selectOne(timerOptions, item, "timer"));
  });

  challengeOptions.forEach(item => {
    item.addEventListener("click", () => selectOne(challengeOptions, item, "challenge"));
  });

  startButton.addEventListener("click", () => {
    if (!startButton.disabled) {
      window.location.href = "jogoSingleplayer.html";
    }
  });
});

/*fim - selecao do modo de jogo para o singleplayer*/

/* Inicio - atualizacao dos dados estatisticos no quadro da pagina do perfil */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/estatisticas/perfil");
        const estatisticas = await response.json();

        document.getElementById("total-pontos").textContent = estatisticas.totalPontos;
        document.getElementById("respostas-encontradas").textContent = estatisticas.respostasEncontradas;
        document.getElementById("respostas-erradas").textContent = estatisticas.respostasErradas;
        document.getElementById("tempo-total").textContent = estatisticas.tempoTotal;
    } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
    }
});
/* Fim - atualizacao dos dados estatisticos no quadro da pagina do perfil */

/* Inicio - atualizacao dos dados do utilizador dentro das respetovas caixas de texto na pagina de perfil */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resposta = await fetch("/profile", {
            method: "GET",
            credentials: "include"
        });

        if (!resposta.ok) {
            throw new Error("Erro ao carregar perfil");
        }

        const utilizador = await resposta.json();

        document.getElementById("displayName").value = utilizador.nickname || "";
        document.getElementById("username").value = utilizador.username || "";

        // Nunca preencher a password real
        document.getElementById("password").value = "********";
    } catch (erro) {
        console.error("Erro:", erro);
    }
});

/* Fim - atualizacao dos dados do utilizador dentro das respetovas caixas de texto na pagina de perfil */


/* Inicio - Barra pop-up para guardar as alteracoes feitas aquando o utilizador comeca a escrver na barra do nickname na pagina de perfil */

const nicknameInput = document.getElementById('nickname');
const saveBar = document.getElementById('save-bar');
const btnSave = document.getElementById('btn-save');
const btnReset = document.getElementById('btn-reset');

let originalValue = nicknameInput.value;

nicknameInput.addEventListener('input', () => {
  const isDirty = nicknameInput.value !== originalValue;
  saveBar.classList.toggle('show', isDirty);
});

btnReset.addEventListener('click', () => {
  nicknameInput.value = originalValue;
  saveBar.classList.remove('show');
});

btnSave.addEventListener('click', () => {
  console.log('Guardado:', nicknameInput.value);

  originalValue = nicknameInput.value;
  saveBar.classList.remove('show');
});

/* Fim - Barra pop-up para guardar as alteracoes feitas aquando o utilizador comeca a escrver na barra do nickname na pagina de perfil */

/* Inicio - Validacao dos campos da pagina de alteracao da password */

const form = document.getElementById("formAlterarPassword");
    const nova = document.getElementById("nova");
    const confirmar = document.getElementById("confirmar");
    const erro = document.getElementById("erroPassword");

    form.addEventListener("submit", function(event) {
      erro.textContent = "";

      if (nova.value !== confirmar.value) {
        event.preventDefault();
        erro.textContent = "A nova palavra-passe e a confirmação não coincidem.";
        return;
      }

      // Se quiseres apenas testar sem servidor:
      event.preventDefault();
      alert("Palavra-passe alterada com sucesso!");
      window.location.href = "perfil.html";
});

/* Fim - Validacao dos campos da pagina de alteracao da password */
