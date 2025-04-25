import { Conductor } from './Conductor.js';

export class Presenter {
  constructor() {
    this.conductor = new Conductor();
    this.mostrarTodos = false;
    this.zonaSeleccionada = '';
  }

  mostrarSurtidores() {
    const lista = document.getElementById('lista-surtidores');
    lista.innerHTML = '';
  
    let surtidores = this.conductor.listaSurtidores();
  
    if (!this.mostrarTodos) {
      surtidores = surtidores.filter(s => s.estado === 'Disponible');
    }
  
    if (this.zonaSeleccionada) {
      surtidores = surtidores.filter(s => s.zona === this.zonaSeleccionada);
    }
  
    surtidores.forEach(s => {
      const item = document.createElement('li');
      item.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila} - Zona: ${s.zona}`;
  
      // Cambiar color si no hay gasolina
      if (s.estado === 'Sin gasolina') {
        item.style.color = 'red';
      }
  
      // Botón eliminar
      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.style.marginLeft = '10px';
      btnEliminar.onclick = () => {
        this.conductor.eliminarSurtidor(s.nombre);
        this.mostrarSurtidores();
      };
  
      // Botón editar
      const btnEditar = document.createElement('button');
btnEditar.textContent = 'Editar';
btnEditar.style.marginLeft = '5px';
btnEditar.onclick = () => {
  const nuevoNombre = prompt('Nuevo nombre:', s.nombre);
  const nuevoEstado = prompt('Nuevo estado (Disponible o Sin gasolina):', s.estado);
  const nuevaFila = prompt('Nueva cantidad de autos en fila:', s.fila);

  const zonasDisponibles = ['Cercado', 'Pacata', 'Quillacollo', 'Tiquipaya'];
  const zonaPrompt = zonasDisponibles.map((z, i) => `${i + 1}. ${z}`).join('\n');
  const zonaSeleccion = prompt(`Seleccione nueva zona:\n${zonaPrompt}`, zonasDisponibles.indexOf(s.zona) + 1);
  const nuevaZona = zonasDisponibles[parseInt(zonaSeleccion) - 1];

  if (
    nuevoNombre &&
    (nuevoEstado === 'Disponible' || nuevoEstado === 'Sin gasolina') &&
    !isNaN(nuevaFila) &&
    nuevaZona
  ) {
    this.conductor.editarSurtidor(s.nombre, nuevoNombre, nuevoEstado, nuevaFila, nuevaZona);
    this.mostrarSurtidores();
  } else {
    alert('Entrada no válida');
  }
      };
  
      item.appendChild(btnEliminar);
      item.appendChild(btnEditar);
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
