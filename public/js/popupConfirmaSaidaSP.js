'use strict'

const btnSair = document.getElementById('btnSair');
    const popupSair = document.getElementById('popupSair');
    const confirmarSair = document.getElementById('confirmarSair');
    const cancelarSair = document.getElementById('cancelarSair');

    btnSair.addEventListener('click', function (event) {
        event.preventDefault();
        popupSair.classList.remove('hidden');
    });

    cancelarSair.addEventListener('click', function () {
        popupSair.classList.add('hidden');
    });

    confirmarSair.addEventListener('click', function () {
        window.location.href = '/selectMultiplayerPage';
    });


popupSair.addEventListener('click', function(e) {
        if (e.target === popupSair) {
            popupSair.classList.add('hidden');
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            popupSair.classList.add('hidden');
        }
    });
