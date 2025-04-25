import { Conductor } from './Conductor.js';

export class Presenter {
  constructor() {
    this.conductor = new Conductor();
    this.mostrarTodos = false;
    this.zonaSeleccionada = '';
  }

  mostrarSurtidores() {
    let surtidores = this.conductor.listaSurtidores();

    if (!this.mostrarTodos) {
      surtidores = surtidores.filter(s => s.estado === 'Disponible');
    }

    if (this.zonaSeleccionada) {
      surtidores = surtidores.filter(s => s.zona === this.zonaSeleccionada);
    }

    const lista = document.getElementById('lista-surtidores');
    lista.innerHTML = '';

    surtidores.forEach(s => {
      const item = document.createElement('li');
      item.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila} - Zona: ${s.zona}`;
      lista.appendChild(item);
    });
  }

  manejarFormulario() {
    const form = document.getElementById('form-surtidor');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = form.querySelector('#nombre').value.trim();
      const estado = form.querySelector('#estado').value;
      const fila = form.querySelector('#fila').value;
      const zona = form.querySelector('#zona').value;

      if (!nombre || !fila || !zona) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      this.conductor.agregarSurtidor(nombre, estado, fila, zona);
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

  manejarFiltroZona() {
    const select = document.getElementById('filtro-zona');
    select.addEventListener('change', (e) => {
      this.zonaSeleccionada = e.target.value;
      this.mostrarSurtidores();
    });
  }

  manejarBusquedaNombre() {
    const inputBusqueda = document.getElementById('busqueda-nombre');
  
    inputBusqueda.addEventListener('input', (e) => {
      const texto = e.target.value.toLowerCase();
      let surtidores = this.conductor.listaSurtidores();
  
      if (!this.mostrarTodos) {
        surtidores = surtidores.filter(s => s.estado === 'Disponible');
      }
  
      if (this.zonaSeleccionada) {
        surtidores = surtidores.filter(s => s.zona === this.zonaSeleccionada);
      }
  
      surtidores = surtidores.filter(s =>
        s.nombre.toLowerCase().includes(texto)
      );
  
      const lista = document.getElementById('lista-surtidores');
      lista.innerHTML = '';
  
      surtidores.forEach(s => {
        const item = document.createElement('li');
        item.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila} - Zona: ${s.zona}`;
        lista.appendChild(item);
      });
    });
  }

  inicializar() {
    this.mostrarSurtidores();
    this.manejarFormulario();
    this.manejarToggle();
    this.manejarFiltroZona();
    this.manejarBusquedaNombre();
  }
}
