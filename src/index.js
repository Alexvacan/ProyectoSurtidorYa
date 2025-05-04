// src/index.js
console.log('El proyecto se ha cargado correctamente.');

import { Presenter } from './presenter.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('Hola, el proyecto se ha cargado correctamente');
  const presenter = new Presenter();
  presenter.inicializar();
});

// Nota:
// — Hemos eliminado la clase GestorReabastecimiento y su listener de form-surtidor
//   porque Presenter ya se encarga de capturar #form-surtidor en manejarFormulario()
//   (y de agregar y renderizar los surtidores, incluyendo ordenación).
// — De este modo, #form-surtidor funciona correctamente junto con el sort-criteria.
