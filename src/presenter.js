import { Conductor } from './Conductor.js';

export class Presenter {
  constructor() {
    this.conductor = new Conductor();
  }

  mostrarSurtidores() {
    const surtidores = this.conductor.listaSurtidores();
    const disponibles = surtidores.filter(s => s.estado === 'Disponible');

    const lista = document.getElementById('lista-surtidores');
    lista.innerHTML = '';

    disponibles.forEach(s => {
      const item = document.createElement('li');
      item.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila}`;
      lista.appendChild(item);
    });
  }

  manejarFormulario() {
    const form = document.getElementById('form-surtidor');

    form.addEventListener('submit', (e) => {
      e.preventDefault(); // 👈 Esto evita recargar

      const nombre = form.querySelector('#nombre').value.trim();
      const estado = form.querySelector('#estado').value;
      const fila = form.querySelector('#fila').value;

      // Validamos que no estén vacíos
      if (!nombre || !fila) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      this.conductor.agregarSurtidor(nombre, estado, fila);
      this.mostrarSurtidores();
      form.reset(); // limpia el formulario
    });
  }
}
