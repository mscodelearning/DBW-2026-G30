'use strict'

document.querySelectorAll('.caixa-filtro-dropdown').forEach((dropdown) => {
    const btn = dropdown.querySelector('.btn-filtro');
    const menu = dropdown.querySelector('.menu-filtro');

    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      menu.classList.toggle('show');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-filtro.show').forEach((menu) => {
      menu.classList.remove('show');
    });
  });