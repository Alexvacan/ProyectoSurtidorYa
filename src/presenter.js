import { Conductor } from './Conductor.js';

export class Presenter {
  constructor() {
    this.conductor = new Conductor();
    this.mostrarTodos = false;
  }

  mostrarSurtidores() {
    const surtidores = this.conductor.listaSurtidores();
    const filtrados = this.mostrarTodos
      ? surtidores
      : surtidores.filter(s => s.estado === 'Disponible');

    const lista = document.getElementById('lista-surtidores');
    lista.innerHTML = '';

    const titulo = document.getElementById('titulo');
    titulo.textContent = this.mostrarTodos
      ? 'Todos los surtidores'
      : 'Surtidores disponibles';

    if (filtrados.length === 0) {
      const item = document.createElement('li');
      item.textContent = 'No hay surtidores para mostrar.';
      lista.appendChild(item);
      return;
    }

    filtrados.forEach(s => {
      const item = document.createElement('li');
      item.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila}`;
      lista.appendChild(item);
    });
  }

  manejarFormulario() {
    const form = document.getElementById('form-surtidor');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = form.querySelector('#nombre').value.trim();
      const estado = form.querySelector('#estado').value.trim(); // aseguramos que no haya espacios
      const fila = form.querySelector('#fila').value;

      if (!nombre || fila === '') {
        alert('Por favor, completa todos los campos.');
        return;
      }

      this.conductor.agregarSurtidor(nombre, estado, fila);
      this.mostrarSurtidores();
      form.reset();
    });
  }

  manejarToggle() {
    const boton = document.getElementById('toggle-estado');
    boton.addEventListener('click', () => {
      this.mostrarTodos = !this.mostrarTodos;
      boton.textContent = this.mostrarTodos
        ? 'Mostrar solo disponibles'
        : 'Mostrar todos los surtidores';
      this.mostrarSurtidores();
    });
  }
}
