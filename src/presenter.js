import { Conductor } from './Conductor.js';
import { calcularProbabilidadCarga } from './probabilidadCargaService';


export class Presenter {
  constructor() {
    this.conductor = new Conductor();
    this.mostrarTodos = false;
    this.zonaSeleccionada = '';
    this.nombreEditando = null;
    this.modelo = this.conductor;

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
      const nivel = this.conductor.nivelGasolina(s.litros);
      const item = document.createElement('li');
      item.innerHTML = `
      <strong>${s.nombre}</strong> - ${s.estado}<br>
      Autos en fila: ${s.fila} - Zona: ${s.zona}<br>
      Nivel de gasolina: ${nivel} (${s.litros} litros)<br>
      Horario de atención: ${s.horarioApertura} - ${s.horarioCierre}<br>
      Contacto: ${s.contacto}
    `;
const probabilidad = calcularProbabilidadCarga({
        combustibleDisponible: s.litros,
        autosEsperando: s.fila,
        consumoPromedioPorAuto: 10
      });

      const item_conductor = document.createElement('li');
      item_conductor.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila} - Zona: ${s.zona} - Nivel de gasolina: ${nivel} (${s.litros} litros)
      | Probabilidad de carga: ${probabilidad.porcentaje}% | Autos que podrán cargar: ${probabilidad.autosQuePodranCargar}`;
      
      const infoProbabilidad = document.createElement('p');
      infoProbabilidad.textContent = `Probabilidad de carga: ${probabilidad.porcentaje}% (${probabilidad.autosQuePodranCargar} autos podrán cargar)`;
      infoProbabilidad.style.margin = '5px 0';
      item.appendChild(infoProbabilidad);


      if (s.estado === 'Sin gasolina') {
        item.style.color = 'red';
      } else {
        const nivel = this.conductor.nivelGasolina(s.litros);
        if (nivel === 'Alto') {
          item.style.color = 'green';
        } else if (nivel === 'Medio') {
          item.style.color = 'orange';
        } else if (nivel === 'Bajo') {
          item.style.color = 'blue';
        }
      }      

      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.style.marginLeft = '10px';
      btnEliminar.onclick = () => {
        this.conductor.eliminarSurtidor(s.nombre);
        this.mostrarSurtidores();
      };

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

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = form.querySelector('#nombre').value.trim();
      const estado = form.querySelector('#estado').value;
      const fila = form.querySelector('#fila').value;
      const zona = form.querySelector('#zona').value;
      const litros = form.querySelector('#litros').value;
      const horarioApertura = form.querySelector('#horario-apertura').value;
      const horarioCierre = form.querySelector('#horario-cierre').value;
      const contacto = form.querySelector('#contacto').value;


      if (!nombre || !fila || !zona) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      this.conductor.agregarSurtidor(nombre, estado, fila, zona, parseInt(litros),horarioApertura, horarioCierre, contacto);
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
        item.textContent = `${s.nombre} - ${s.estado} - Autos en fila: ${s.fila} - Zona: ${s.zona} - Litros: ${s.litros}`;
        lista.appendChild(item);
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

    const btnCancelar = document.getElementById('cancelar-edicion');
    btnCancelar.addEventListener('click', () => {
      this.modalEdicion.classList.add('oculto');
    });
  }

  obtenerProbabilidadCarga(nombreSurtidor) {
    const surtidor = this.conductor.obtenerSurtidorPorNombre(nombreSurtidor);
  
    if (!surtidor) {
      return {
        porcentaje: 0,
        autosQuePodranCargar: 0
      };
    }
  
    const datos = {
      combustibleDisponible: surtidor.litros,
      autosEsperando: surtidor.fila,
      consumoPromedioPorAuto: 10
    };
  
    return calcularProbabilidadCarga(datos);
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
  }

  
}
