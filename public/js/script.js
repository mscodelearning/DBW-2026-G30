
'use strict';

/* Inicio - introducao dos dados nas caixas de texto para a pagina do login e do signin com pop-up na web*/

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

/* Fim - introducao dos dados nas caixas de texto para a pagina do login e do signin com pop-up na web*/

/*
document.addEventListener("DOMContentLoaded", () => {

Inicio - codigo do pop up para colocar/alterar imagem

const texto = document.getElementById("texto-altera-imagem");
const popup = document.getElementById("pop-up");


if (texto && popup) {
        texto.addEventListener("click", () => 
          popup.style.display = "flex");
        popup.addEventListener("click", (e) => {
            if (e.target === popup) popup.style.display = "none";
        });
}

Fim - codigo do pop up para colocar/alterar imagem


 Inicio - codigo do drag and drop imagem 

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

/* Fim - codigo do drag and drop imagem 
*/


/* Inicio - atualizacao dos dados estatisticos no quadro da pagina do perfil */
/*
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
*/
/* Fim - atualizacao dos dados estatisticos no quadro da pagina do perfil */

/* Inicio - atualizacao dos dados do utilizador dentro das respetovas caixas de texto na pagina de perfil */
/*
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
*/
/* Fim - atualizacao dos dados do utilizador dentro das respetovas caixas de texto na pagina de perfil */
/* Inicio - Barra pop-up para guardar as alteracoes feitas aquando o utilizador comeca a escrver na barra do nickname na pagina de perfil */
/*
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
*/
/* Fim - Barra pop-up para guardar as alteracoes feitas aquando o utilizador comeca a escrver na barra do nickname na pagina de perfil */


/* Inicio - Validacao dos campos da pagina de alteracao da password */
/*
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
*/
/* Fim - Validacao dos campos da pagina de alteracao da password */


/* Inicio - pop-up icon user na barra de navegacao */

let subMenu = document.getElementById("subMenu");

function toggleMenu(){
  subMenu.classList.toggle("open-menu");
}

/* Fim - pop-up icon user na barra de navegacao */


