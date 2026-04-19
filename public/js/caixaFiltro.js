'use strict'

document.querySelectorAll('.caixa-filtro-dropdown').forEach((dropdown) => {
    const btn = dropdown.querySelector('.btn-filtro');
    const menu = dropdown.querySelector('.menu-filtro');

    btn.addEventListener('click', (event) => {
      event.stopPropagation(); // evita conflito com clique fora
      menu.classList.toggle('show');
    });
  });

  // fechar todos os dropdowns ao clicar fora
  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-filtro.show').forEach((menu) => {
      menu.classList.remove('show');
    });
  });