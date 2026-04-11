'use strict';

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
        console.error("Elementos obrigatórios em falta!");
        return;
    }


const defaultPerfilSrc = perfilImg.src;
let currentImageUrl = null; // guarda o url do preview

inputFile.addEventListener("change", uploadImage); /* IMPORTANTE */

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