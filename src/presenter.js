import { Conductor } from './Conductor.js';

export class Presenter {
  constructor() {
    this.conductor = new Conductor();
  }

  mostrarSurtidores() {
    const surtidores = this.conductor.listaSurtidores();
    const lista = document.getElementById('lista-surtidores');
    lista.innerHTML = '';

    surtidores.forEach(s => {
      const item = document.createElement('li');
      item.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila}`;
      lista.appendChild(item);
    });
  }
}
