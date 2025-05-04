import { Conductor } from './Conductor.js';
import { calcularProbabilidadCarga } from './probabilidadCargaService';

export class Presenter {
  constructor() {
    this.conductor = new Conductor();
    this.mostrarTodos = false;
    this.zonaSeleccionada = '';
    this.nombreEditando = null;
    this.modelo = this.conductor;

    // Referencias al DOM para edición
    this.modalEdicion = document.getElementById('modal-edicion');
    this.editarNombre = document.getElementById('editar-nombre');
    this.editarEstado = document.getElementById('editar-estado');
    this.editarFila = document.getElementById('editar-fila');
    this.editarZona = document.getElementById('editar-zona');
    this.editarLitros = document.getElementById('editar-litros');
    this.btnGuardarEdicion = document.getElementById('guardar-edicion');
    this.horarioAperturaInput = document.getElementById('horario-apertura');
    this.horarioCierreInput = document.getElementById('horario-cierre');
    this.contactoInput = document.getElementById('contacto');

    // Criterio y control de ordenación
    this.sortCriteria = 'nombre';
    this.sortSelect   = document.getElementById('sort-criteria');
  }

  // Ordena una copia de la lista según el criterio actual
  sortList(list) {
    return [...list].sort((a, b) => {
      const key = this.sortCriteria;
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  }

  // Maneja el evento de cambio en el selector de ordenación
  manejarOrdenacion() {
    this.sortSelect.addEventListener('change', e => {
      this.sortCriteria = e.target.value;
      this.mostrarSurtidores();
    });
  }

  // Renderiza la lista de surtidores con filtros y ordenación
  mostrarSurtidores() {
    const lista = document.getElementById('lista-surtidores');
    lista.innerHTML = '';

    // Obtener y ordenar
    let surtidores = this.sortList(this.conductor.listaSurtidores());

    if (!this.mostrarTodos) {
      surtidores = surtidores.filter(s => s.estado === 'Disponible');
    }
    if (this.zonaSeleccionada) {
      surtidores = surtidores.filter(s => s.zona === this.zonaSeleccionada);
    }

    surtidores.forEach(s => {
      const nivel = this.conductor.nivelGasolina(s.litros);
      const item = document.createElement('li');
      item.innerHTML = `
        <strong>${s.nombre}</strong> - ${s.estado}<br>
        Autos en fila: ${s.fila} - Zona: ${s.zona}<br>
        Nivel de gasolina: ${nivel} (${s.litros} litros)<br>
        Horario de atención: ${s.horarioApertura} - ${s.horarioCierre}<br>
        Contacto: ${s.contacto}
      `;

      // Probabilidad de carga
      const prob = calcularProbabilidadCarga({
        combustibleDisponible: s.litros,
        autosEsperando: s.fila,
        consumoPromedioPorAuto: 10
      });
      const infoProb = document.createElement('p');
      infoProb.textContent = `Probabilidad de carga: ${prob.porcentaje}% (${prob.autosQuePodranCargar} autos podrán cargar)`;
      infoProb.style.margin = '5px 0';
      item.appendChild(infoProb);

      // Colorear según estado
      if (s.estado === 'Sin gasolina') {
        item.style.color = 'red';
      } else if (nivel === 'Alto') {
        item.style.color = 'green';
      } else if (nivel === 'Medio') {
        item.style.color = 'orange';
      } else {
        item.style.color = 'blue';
      }

      // Botón Eliminar
      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.style.marginLeft = '10px';
      btnEliminar.onclick = () => {
        this.conductor.eliminarSurtidor(s.nombre);
        this.mostrarSurtidores();
      };

      // Botón Editar
      const btnEditar = document.createElement('button');
      btnEditar.textContent = 'Editar';
      btnEditar.style.marginLeft = '10px';
      btnEditar.onclick = () => {
        this.nombreEditando = s.nombre;
        this.editarNombre.value = s.nombre;
        this.editarEstado.value = s.estado;
        this.editarFila.value = s.fila;
        this.editarZona.value = s.zona;
        this.editarLitros.value = s.litros;
        this.modalEdicion.classList.remove('oculto');
      };

      item.appendChild(btnEliminar);
      item.appendChild(btnEditar);
      lista.appendChild(item);
    });
  }

  manejarFormulario() {
    const form = document.getElementById('form-surtidor');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nombre = form.querySelector('#nombre').value.trim();
      const estado = form.querySelector('#estado').value;
      const fila = form.querySelector('#fila').value;
      const zona = form.querySelector('#zona').value;
      const litros = form.querySelector('#litros').value;
      const horarioApertura = form.querySelector('#hora-reabastecimiento').value;
      const horarioCierre = form.querySelector('#horario-cierre').value;
      const contacto = form.querySelector('#contacto').value;

      if (!nombre || !fila || !zona) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      this.conductor.agregarSurtidor(
        nombre,
        estado,
        fila,
        zona,
        parseInt(litros),
        horarioApertura,
        horarioCierre,
        contacto
      );
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
    select.addEventListener('change', e => {
      this.zonaSeleccionada = e.target.value;
      this.mostrarSurtidores();
    });
  }

  manejarBusquedaNombre() {
    const input = document.getElementById('busqueda-nombre');
    input.addEventListener('input', e => {
      const texto = e.target.value.toLowerCase();
      let lista = this.sortList(this.conductor.listaSurtidores());

      if (!this.mostrarTodos) {
        lista = lista.filter(s => s.estado === 'Disponible');
      }
      if (this.zonaSeleccionada) {
        lista = lista.filter(s => s.zona === this.zonaSeleccionada);
      }
      lista = lista.filter(s => s.nombre.toLowerCase().includes(texto));

      const ul = document.getElementById('lista-surtidores');
      ul.innerHTML = '';
      lista.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila} - Zona: ${s.zona} - Litros: ${s.litros}`;
        ul.appendChild(li);
      });
    });
  }

  manejarEdicion() {
    this.btnGuardarEdicion.addEventListener('click', () => {
      this.conductor.editarSurtidor(
        this.nombreEditando,
        this.editarNombre.value,
        this.editarEstado.value,
        this.editarFila.value,
        this.editarZona.value,
        this.editarLitros.value,
        this.horarioAperturaInput.value,
        this.horarioCierreInput.value,
        this.contactoInput.value
      );
      this.modalEdicion.classList.add('oculto');
      this.mostrarSurtidores();
    });
    document
      .getElementById('cancelar-edicion')
      .addEventListener('click', () => this.modalEdicion.classList.add('oculto'));
  }

  obtenerProbabilidadCarga(nombreSurtidor) {
    const surtidor = this.conductor.obtenerSurtidorPorNombre(nombreSurtidor);
    if (!surtidor) return { porcentaje: 0, autosQuePodranCargar: 0 };

    return calcularProbabilidadCarga({
      combustibleDisponible: surtidor.litros,
      autosEsperando: surtidor.fila,
      consumoPromedioPorAuto: 10
    });
  }

  obtenerSurtidorPorNombre(nombre) {
    return this.surtidores.find(s => s.nombre === nombre);
  }

  inicializar() {
    this.mostrarSurtidores();
    this.manejarFormulario();
    this.manejarToggle();
    this.manejarFiltroZona();
    this.manejarBusquedaNombre();
    this.manejarEdicion();
    this.manejarOrdenacion();
  }
}
