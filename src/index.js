console.log('El proyecto se ha cargado correctamente.');

import { Presenter } from './presenter.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('Hola, el proyecto se ha cargado correctamente');
  const presenter = new Presenter();
  presenter.inicializar();
});

