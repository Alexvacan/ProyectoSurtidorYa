import { Conductor } from './Conductor.js';
import { calcularProbabilidadCarga } from './probabilidadCargaService.js';
import { TimeSlotService } from './timeSlotService.js';


export class Presenter {
  constructor() {
    this.conductor = new Conductor();
    this.mostrarTodos = false;
    this.zonaSeleccionada = '';
    this.nombreEditando = null;

    this.modalEdicion = document.getElementById('modal-edicion');
    this.editarNombre = document.getElementById('editar-nombre');
    this.editarDireccionInput = document.getElementById('editar-direccion');
    this.editarEstado = document.getElementById('editar-estado');
    this.editarFila = document.getElementById('editar-fila');
    this.editarZona = document.getElementById('editar-zona');
    this.editarLitros = document.getElementById('editar-litros');
    this.btnGuardarEdicion = document.getElementById('guardar-edicion');
    this.apertura = document.getElementById('apertura');
    this.cierre = document.getElementById('cierre');
    this.contacto = document.getElementById('contacto');
    this.editarApertura = document.getElementById('editar-apertura');
    this.editarCierre = document.getElementById('editar-cierre');
    this.editarContacto = document.getElementById('editar-contacto')
    this.sortCriteria = 'nombre';
    this.sortSelect = document.getElementById('sort-criteria');

    this.selectSurtidorFranja = document.getElementById('surtidor-seleccionado');
    this.btnCalcularProb       = document.getElementById('calcular-probabilidad');
    this.textoProbabilidad     = document.getElementById('texto-probabilidad');
    // ← Aquí añades:
    this.direccionInput        = document.getElementById('direccion');
    this.sortCriteria = 'nombre';
  }

  sortList(list) {
    return [...list].sort((a, b) => {
      const key = this.sortCriteria;
      const valA = isNaN(a[key]) ? a[key].toString().toLowerCase() : Number(a[key]);
      const valB = isNaN(b[key]) ? b[key].toString().toLowerCase() : Number(b[key]);
      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });
  }

  manejarOrdenacion() {
    if (!this.sortSelect) return;
    this.sortSelect.addEventListener('change', e => {
      this.sortCriteria = e.target.value;
      this.mostrarSurtidores();
    });
  }

  mostrarSurtidores() {
    const listaEl = document.getElementById('lista-surtidores');
    listaEl.innerHTML = '';
    let surtidores = this.sortList(this.conductor.listaSurtidores());
    if (!this.mostrarTodos) {
      surtidores = surtidores.filter(s => s.estado === 'Disponible');
    }
    if (this.zonaSeleccionada) {
      surtidores = surtidores.filter(s => s.zona === this.zonaSeleccionada);
    }

    surtidores.forEach(s => {
      const nivel = this.conductor.nivelGasolina(s.litros); // Asegúrate de que esta línea esté presente
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${s.nombre}</strong> - ${s.estado}<br>
        <em>Dirección:</em> ${s.direccion}<br>
        Autos en fila: ${s.fila} - Zona: ${s.zona}<br>
        Nivel de gasolina: ${nivel} (${s.litros} litros)<br>
        Horario: ${s.apertura} - ${s.cierre}<br>
        Contacto: ${s.contacto}
      `;

      const tipoAuto = s.tipoAuto || 'pequeno'; 
    const prob = calcularProbabilidadCarga({
      combustibleDisponible: Number(s.litros), // <--- aquí
      autosEsperando: Number(s.fila),          // <--- y aquí
      tipoAuto: tipoAuto 
    });
    const p = document.createElement('p');
    p.textContent = `Probabilidad de carga: ${prob.porcentaje}% (${prob.autosQuePodranCargar} autos)`;
    li.appendChild(p);

      if (s.estado === 'Sin gasolina') li.style.color = 'red';
      else if (nivel === 'Alto') li.style.color = 'green';
      else if (nivel === 'Medio') li.style.color = 'orange';
      else li.style.color = 'blue';

      // Botones
      const btnDel = document.createElement('button');
      btnDel.textContent = 'Eliminar';
      btnDel.style.marginLeft = '10px';
      btnDel.onclick = () => {
        this.conductor.eliminarSurtidor(s.nombre);
        this.mostrarSurtidores();
      };

      const btnEdit = document.createElement('button');
      btnEdit.textContent = 'Editar';
      btnEdit.style.marginLeft = '10px';
      btnEdit.onclick = () => {
        this.nombreEditando = s.nombre;
        this.editarNombre.value = s.nombre;
        this.editarEstado.value = s.estado;
        this.editarFila.value = s.fila;
        this.editarZona.value = s.zona;
        this.editarLitros.value = s.litros;
        this.editarApertura.value = s.apertura;
        this.editarCierre.value = s.cierre;
        this.editarContacto.value = s.contacto;
        this.editarDireccionInput.value = s.direccion;
        this.modalEdicion.classList.remove('oculto');
      };

      li.appendChild(btnDel);
      li.appendChild(btnEdit);
      listaEl.appendChild(li);
    });
  }

  manejarFormulario() {
    const form = document.getElementById('form-surtidor');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nombre = form.querySelector('#nombre').value.trim();
      const direccion = form.querySelector('#direccion').value.trim();
      const estado = form.querySelector('#estado').value;
      const fila = form.querySelector('#fila').value;
      const zona = form.querySelector('#zona').value;
      const litros = form.querySelector('#litros').value;
      const apertura = form.querySelector('#apertura').value;
      const cierre = form.querySelector('#cierre').value;
      const contacto = form.querySelector('#contacto').value;
  
      if (!nombre || !direccion || !fila || !zona) {
        alert('Por favor, completa todos los campos.');
        return;
      }
  
      try {
        const data = {
          nombre,
          direccion,
          estado,
          fila,
          zona,
          litros,
          apertura,
          cierre,
          contacto
        };
  
        this.conductor.agregarSurtidor(data);
        alert("Surtidor agregado correctamente.");
        form.reset();
        this.mostrarSurtidores();
      } catch (error) {
        console.error(error.message);
        alert("Error al agregar surtidor: " + error.message);
      }
    });
  }  

  manejarToggle() {
    const btn = document.getElementById('toggle-estado');
    btn.addEventListener('click', () => {
      this.mostrarTodos = !this.mostrarTodos;
      btn.textContent = this.mostrarTodos
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
      if (!this.mostrarTodos) lista = lista.filter(s => s.estado === 'Disponible');
      if (this.zonaSeleccionada) lista = lista.filter(s => s.zona === this.zonaSeleccionada);
      lista = lista.filter(s => s.nombre.toLowerCase().includes(texto));

      const ul = document.getElementById('lista-surtidores');
      ul.innerHTML = '';
      lista.forEach(s => { const li = document.createElement('li'); li.textContent = `${s.nombre} - ${s.estado} - fila: ${s.fila} - zona: ${s.zona} - litros: ${s.litros}`; ul.appendChild(li); });
    });
  }

  // Muestra las franjas horarias para un surtidor
  mostrarFranjas(surtidorNombre) {
    const slots = TimeSlotService.listarSlots(surtidorNombre);
    const ul = document.getElementById('lista-franjas');
    ul.innerHTML = '';
    slots.forEach(slot => {
      const li = document.createElement('li');
      li.textContent = `${slot.horaInicio} - ${slot.horaFin}`;
      li.classList.add(slot.disponible ? 'disponible' : 'ocupado');
      ul.appendChild(li);
    });
  }

  // Pone opciones en el select de surtidor y maneja cambio
  manejarSeleccionSurtidor() {
    const surtidores = this.conductor.listaSurtidores();
    if (this.selectSurtidorFranja) {
      this.selectSurtidorFranja.innerHTML = surtidores.map(s => `<option value="${s.nombre}">${s.nombre}</option>`).join('');
      this.selectSurtidorFranja.addEventListener('change', e => {
        this.mostrarFranjas(e.target.value);
      });
      if (surtidores.length) this.mostrarFranjas(surtidores[0].nombre);
    }
  }
  manejarCalculoProbabilidad() {
    this.btnCalcularProb.addEventListener('click', () => {
      const nombre = this.selectSurtidorFranja.value;
      const { porcentaje, autosQuePodranCargar } = this.obtenerProbabilidadCarga(nombre);
      this.textoProbabilidad.textContent = `Probabilidad de carga: ${porcentaje}% (${autosQuePodranCargar} autos podrán cargar)`;
    });
  }
  
  manejarEdicion() {
    this.btnGuardarEdicion.addEventListener('click', () => {
      this.conductor.editarSurtidor(
        this.nombreEditando,
        this.editarNombre.value,
        this.editarDireccionInput.value,
        this.editarEstado.value,
        parseInt(this.editarFila.value, 10),
        this.editarZona.value,
        parseFloat(this.editarLitros.value),
        this.editarApertura.value,
        this.editarCierre.value,
        this.editarContacto.value
      );
      this.modalEdicion.classList.add('oculto');
      this.mostrarSurtidores();
    });
    document.getElementById('cancelar-edicion').addEventListener('click', () => this.modalEdicion.classList.add('oculto'));
  }

  obtenerProbabilidadCarga(nombre) {
    const s = this.conductor.obtenerSurtidorPorNombre(nombre);
    if (!s) return { porcentaje: 0, autosQuePodranCargar: 0 };
    return calcularProbabilidadCarga({
      combustibleDisponible: Number(s.litros),
      autosEsperando: Number(s.fila),
      consumoPromedioPorAuto: 10
    });
  }

  generarTicket() {
    const estacion = document.getElementById('inputEstacion').value.trim();
    const tipoCombustible = document.getElementById('inputCombustible').value.trim();
  
    if (!estacion || !tipoCombustible) {
      alert('Por favor, ingresa estación y tipo de combustible.');
      return;
    }
  
    // Elegimos un surtidor cualquiera para mostrar info (por ejemplo el primero disponible)
    const surtidor = this.conductor.listaSurtidores().find(s => s.estado === 'Disponible');
    if (!surtidor) {
      alert('No hay surtidores disponibles.');
      return;
    }
  
    const fecha = new Date().toLocaleString();
  
    const ticket = `
  *** TICKET DE SURTIDOR ***
  Estación: ${estacion}
  Surtidor: ${surtidor.nombre}
  Tipo de combustible: ${tipoCombustible}
  Zona: ${surtidor.zona}
  Litros disponibles: ${surtidor.litros}
  Horario: ${surtidor.apertura} - ${surtidor.cierre}
  Fecha emisión: ${fecha}
  ----------------------------
    `;
  
    // Mostrar en textarea o pre
    const salida = document.getElementById('ticketOutput');
    if (salida) salida.textContent = ticket;
  }

  inicializar() {
    this.mostrarSurtidores();
    this.manejarFormulario();
    this.manejarToggle();
    this.manejarFiltroZona();
    this.manejarBusquedaNombre();
    this.manejarEdicion();
    this.manejarOrdenacion();
    this.manejarSeleccionSurtidor();
    this.manejarCalculoProbabilidad();


    const botonCalcular = document.getElementById('calcular-probabilidad');
botonCalcular.addEventListener('click', () => {
  const select = document.getElementById('surtidor-seleccionado');
  const nombreSeleccionado = select.value;

  const surtidor = this.conductor.listaSurtidores().find(s => s.nombre === nombreSeleccionado);

  if (!surtidor) {
    alert('Surtidor no encontrado');
    return;
  }

  const combustibleDisponible = surtidor.litros;  
  const autosEsperando = surtidor.fila;           
  
  // Suponiendo que el tipo de auto siempre es 'pequeno' (esto puede cambiar dinámicamente si lo necesitas)
  const tipoAuto = 'pequeno'; 

  const resultado = calcularProbabilidadCarga({
    combustibleDisponible,
    autosEsperando,
    tipoAuto
  });

  document.getElementById('texto-probabilidad').innerText =
    `Probabilidad: ${resultado.porcentaje.toFixed(2)}%. Autos que podrán cargar: ${resultado.autosQuePodranCargar}`;
});

  }
}
