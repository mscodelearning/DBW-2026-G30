'use strict';

document.addEventListener("DOMContentLoaded", () => {

const texto = document.getElementById("texto-altera-imagem");
const popup = document.getElementById("pop-up");

// abre o popup de alteracao de imagem e fecha ao clicar fora do conteudo
if (texto && popup) {
        texto.addEventListener("click", () => 
          popup.style.display = "flex");
        popup.addEventListener("click", (e) => {
            if (e.target === popup) popup.style.display = "none";
        });
}


const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");

const uploadText = document.querySelector("#img-view .upload-text");
const btnRemover = document.getElementById("btn-remover");
const btnAplicar = document.getElementById("btn-aplicar");
const perfilImg = document.getElementById("perfil-img");

// garante que os eleemntos principais existem antes de ativar o upload
if (!inputFile || !imageView || !perfilImg) {
        console.error("Elementos obrigatórios em falta!");
        return;
    }


const defaultPerfilSrc = perfilImg.src;
let currentImageUrl = null; // guarda o url do preview

// atualiza o preview quando o utilizador escolhe uma nova imagem
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

// permite arrastar ficheiros para a area de upload
dropArea.addEventListener("dragover", function(e) {
  e.preventDefault();
});

// processa o ficheiro largado na area do upload
dropArea.addEventListener("drop", function(e) {
  e.preventDefault();
  inputFile.files = e.dataTransfer.files;
  uploadImage();
});

// remove a imagem selecionada e repoe o estado inicial do preview
btnRemover.addEventListener("click", () => {
  inputFile.value = "";
  imageView.style.backgroundImage = "none";
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

// impede a submissao se nenhuma imagem tiver sido selecionada
btnAplicar.addEventListener("click", (e) => {
  if (!inputFile.files[0]) {
    e.preventDefault();
    alert("Escolhe uma imagem primeiro.");
    return;
  }
});
});

