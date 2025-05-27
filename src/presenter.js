import { Conductor } from './Conductor.js';
import { calcularProbabilidadCarga } from './probabilidadCargaService.js';
import { TimeSlotService } from './timeSlotService.js';

export class Presenter {
  constructor() {
    this.conductor = new Conductor();
    this.mostrarTodos = false;
    this.zonaSeleccionada = '';
    this.nombreEditando = null;
    this.ticketsPorSurtidor = {};
    this.mostrarTickets = this.mostrarTickets.bind(this);

    // Elementos de edición
    this.modalEdicion = document.getElementById('modal-edicion');
    this.editarNombre = document.getElementById('editar-nombre');
    this.editarDireccionInput = document.getElementById('editar-direccion');
    this.editarEstado = document.getElementById('editar-estado');
    this.editarFila = document.getElementById('editar-fila');
    this.editarZona = document.getElementById('editar-zona');
    this.editarLitros = document.getElementById('editar-litros');
    this.editarApertura = document.getElementById('editar-apertura');
    this.editarCierre = document.getElementById('editar-cierre');
    this.editarContacto = document.getElementById('editar-contacto');
    this.btnGuardarEdicion = document.getElementById('guardar-edicion');

    // Formulario surtidor
    this.apertura = document.getElementById('apertura');
    this.cierre = document.getElementById('cierre');
    this.contacto = document.getElementById('contacto');

    // Búsqueda y filtros
    this.sortCriteria = 'nombre';
    this.sortSelect = document.getElementById('sort-criteria');

    // Franjas
    this.selectSurtidorFranja = document.getElementById('surtidor-seleccionado');
    this.btnCalcularProb       = document.getElementById('calcular-probabilidad');
    this.textoProbabilidad     = document.getElementById('texto-probabilidad');

    // Dirección input (ya existente)
    this.direccionInput        = document.getElementById('direccion');
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
    const nivel = this.conductor.nivelGasolina(s.litros);
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
      combustibleDisponible: Number(s.litros),
      autosEsperando: Number(s.fila),
      tipoAuto
    });

    const p = document.createElement('p');
    p.textContent = `Probabilidad de carga: ${prob.porcentaje}% (${prob.autosQuePodranCargar} autos)`;
    li.appendChild(p);

    if (s.estado === 'Sin gasolina') li.style.color = 'red';
    else if (nivel === 'Alto') li.style.color = 'green';
    else if (nivel === 'Medio') li.style.color = 'orange';
    else li.style.color = 'blue';

    // === Botón Eliminar ===
    const btnDel = document.createElement('button');
    btnDel.textContent = 'Eliminar';
    btnDel.style.marginLeft = '10px';
    btnDel.onclick = () => {
      this.conductor.eliminarSurtidor(s.nombre);
      this.mostrarSurtidores();
    };

    // === Botón Editar ===
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

    // === NUEVO: Botón Generar Ticket ===
    const btnGenerarTicket = document.createElement('button');
    btnGenerarTicket.textContent = 'Generar Ticket';
    btnGenerarTicket.style.marginLeft = '10px';
    btnGenerarTicket.onclick = () => {
      this.mostrarFormularioTicket(s);
    };

    // === NUEVO: Contador de Tickets ===
    const ticketCount = this.ticketsPorSurtidor[s.nombre]?.length || 0;
    const ticketInfo = document.createElement('p');
    ticketInfo.textContent = `Tickets generados: ${ticketCount}`;

    // === NUEVO: Botón Ver Tickets ===
    const btnVerTickets = document.createElement('button');
    btnVerTickets.textContent = 'Ver Tickets';
    btnVerTickets.style.marginLeft = '10px';
    btnVerTickets.onclick = () => {
      const modal = document.getElementById("modal-ver-tickets");
      const inputBuscar = document.getElementById("buscar-ticket");

      inputBuscar.value = ""; // Limpiar búsqueda anterior
      this.mostrarTickets(s.nombre); // Llamar al método mostrarTickets con el nombre del surtidor

      modal.classList.remove("oculto");
    };

    // Agregar todo al <li>
    li.appendChild(btnDel);
    li.appendChild(btnEdit);
    li.appendChild(btnGenerarTicket);
    li.appendChild(ticketInfo);
    li.appendChild(btnVerTickets);

    listaEl.appendChild(li);
  });
}

mostrarTickets(surtidorNombre, filtro = "") {
  console.log('mostrarTickets this:', this);
  console.log('this.editarTicket:', this.editarTicket);

  const tickets = this.ticketsPorSurtidor[surtidorNombre] || [];
  const contenedor = document.getElementById("contenedor-tickets");
  const inputBuscar = document.getElementById("buscar-ticket");

  contenedor.innerHTML = "";

  const filtrados = tickets.filter(t =>
    t.codigo.toLowerCase().includes(filtro) ||
    (t.nombreReservante && t.nombreReservante.toLowerCase().includes(filtro))
  );

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron tickets.</p>";
    return;
  }

  filtrados.forEach((t, index) => {
    const div = document.createElement("div");
    div.className = "ticket";

    div.innerHTML = `
      <p>🧾 Código: ${t.codigo}<br>
      📅 Fecha reserva: ${t.fechaReserva}<br>
      📆 Fecha programada: ${t.fechaProgramada}<br>
      ⏰ Hora: ${t.hora}<br>
      🚗 Tipo de vehículo: ${t.tipoVehiculo || "N/A"}<br>
      💵 Monto: ${t.monto} Bs<br>
      📝 ${t.nombreReservante}</p>
    `;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.onclick = () => this.editarTicket(t.surtidor, index);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => {
      this.eliminarTicket(t.surtidor, index);
      this.mostrarTickets(surtidorNombre, inputBuscar.value.toLowerCase());
    };

    div.appendChild(btnEditar);
    div.appendChild(btnEliminar);

    contenedor.appendChild(div);
  });

  inputBuscar.oninput = () => this.mostrarTickets(surtidorNombre, inputBuscar.value.toLowerCase());
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

  crearTarjetaSurtidor(surtidor) {
  const div = document.createElement("div");
  div.classList.add("tarjeta");
  div.id = `surtidor-${surtidor.nombre}`;

  div.innerHTML = `
    <h3>${surtidor.nombre}</h3>
    <p>Zona: ${surtidor.zona}</p>
    <p class="contador-tickets">0</p>
    <button class="btn-generar-ticket">Generar ticket</button>
  `;

  div.querySelector(".btn-generar-ticket").onclick = () => {
    this.mostrarFormularioTicket(surtidor);
  };

  document.getElementById("contenedor-surtidores").appendChild(div);
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
      this.mostrarFranjas(); 
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
generarHorariosSlots() {
    const slots = [];
    for (let h = 6; h < 22; h++) {  
      slots.push({
        start: `${h.toString().padStart(2, '0')}:00`, 
        end:   `${h.toString().padStart(2, '0')}:30`
      });
      slots.push({
        start: `${h.toString().padStart(2, '0')}:30`, 
        end:   `${(h+1).toString().padStart(2, '0')}:00`
      });
    }
    return slots;
  }
   mostrarFranjas() {
    const ul = document.getElementById('lista-franjas');
    ul.innerHTML = '';
    const slots = this.generarHorariosSlots();
    const surtidores = this.conductor.listaSurtidores()
      .filter(s => s.estado === 'Disponible')
      .filter(s => !this.zonaSeleccionada || s.zona === this.zonaSeleccionada);

    slots.forEach(({ start, end }) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${start} - ${end}</strong>`;
      const innerUl = document.createElement('ul');

      surtidores.forEach(s => {
        // comprobar si el surtidor está abierto en ese slot
        if (s.apertura <= start && s.cierre >= end) {
          const { porcentaje } = calcularProbabilidadCarga({
            combustibleDisponible: Number(s.litros),
            autosEsperando: Number(s.fila),
            tipoAuto: 'pequeno'
          });
          const liEst = document.createElement('li');
          liEst.textContent = s.nombre;
          // aplicar color según probabilidad
          if (porcentaje > 70) liEst.style.color = 'green';
          else if (porcentaje >= 40) liEst.style.color = 'orange';
          else liEst.style.color = 'red';
          innerUl.appendChild(liEst);
        }
      });

      li.appendChild(innerUl);
      ul.appendChild(li);
    });
  }

  generarHorariosDisponibles() {
    const horarios = [];
    for (let h = 0; h < 24; h++) {
      horarios.push(`${h.toString().padStart(2, '0')}:00`);
      horarios.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return horarios;
  }

  mostrarFormularioTicket(surtidor, ticket = null, index = null) {
  const modal = document.getElementById("modal-ticket");
  modal.classList.remove("oculto");

  const form = {
    nombre: document.getElementById("ticket-nombre"),
    zona: document.getElementById("ticket-zona"),
    numero: document.getElementById("ticket-numero"),
    hora: document.getElementById("ticket-hora"),
    fechaProgramada: document.getElementById("ticket-fecha-programada"),
    monto: document.getElementById("ticket-monto"),
    fraccion: document.getElementById("ticket-fraccion"),
    nombreReservante: document.getElementById("ticket-nombre-reservante"),
    vehiculo: document.getElementById("ticket-vehiculo")
  };

  if (!this.ticketsPorSurtidor[surtidor.nombre]) {
    this.ticketsPorSurtidor[surtidor.nombre] = [];
  }

  // Variables para saber si estamos editando
  this.ticketEditando = { surtidorNombre: surtidor.nombre, index };

  if (ticket) {
    // Rellenar formulario con ticket existente (editar)
    form.numero.value = ticket.codigo;
    form.nombre.value = surtidor.nombre;
    form.zona.value = surtidor.zona;
    form.hora.value = ticket.hora;
    form.fechaProgramada.value = ticket.fechaProgramada;
    form.monto.value = ticket.monto || "";
    form.fraccion.value = ticket.fraccion || "";
    form.nombreReservante.value = ticket.nombreReservante;
    form.vehiculo.value = ticket.tipoVehiculo || "auto pequeno";
  } else {
    // Crear nuevo ticket
    let codigo;
    try {
      codigo = this.generarCodigoTicket(surtidor);
    } catch (error) {
      alert(`⚠️ ${error.message}.`);
      modal.classList.add("oculto");
      return;
    }
    form.numero.value = codigo;
    form.nombre.value = surtidor.nombre;
    form.zona.value = surtidor.zona;
    form.hora.value = "";
    form.fechaProgramada.value = "";
    form.monto.value = "";
    form.fraccion.value = "";
    form.nombreReservante.value = "";
    form.vehiculo.value = "auto pequeno";
    this.ticketEditando = null; // No estamos editando
  }

  const self = this;

  document.getElementById("guardar-ticket").onclick = function () {
    const horaSeleccionada = form.hora.value;
    const fechaProgramada = form.fechaProgramada.value;
    const monto = parseFloat(form.monto.value);
    const fraccion = parseFloat(form.fraccion.value);
    const fechaReserva = new Date().toISOString().split("T")[0];
    const nombreReservante = form.nombreReservante.value;

    if (self.validarMontoYFraccion(monto, fraccion)) {
      alert("Debes ingresar solo monto o solo fracción del tanque.");
      return;
    }

    if (!self.validarNombre(nombreReservante)) {
      alert("Debe ingresar el nombre del reservante.");
      return;
    }

    if (!fechaProgramada) {
      alert("Debe seleccionar una fecha programada.");
      return;
    }

    const tipoVehiculo = form.vehiculo.value;

    let capacidad = 0;
    if (tipoVehiculo === "moto") capacidad = 22;
    else if (tipoVehiculo === "pequeno") capacidad = 52;
    else if (tipoVehiculo === "grande") capacidad = 85;

    const precioLitro = 3.74;

    if (!isNaN(monto)) {
      const montoMaximo = Math.round(capacidad * precioLitro);
      if (monto > montoMaximo) {
        alert(`El monto no puede superar ${montoMaximo} Bs para un ${tipoVehiculo}.`);
        return;
      }
    }

    if (!isNaN(fraccion)) {
      if (fraccion < 0 || fraccion > 1) {
        alert("La fracción debe estar entre 0 y 1.");
        return;
      }
      const montoCalculado = capacidad * fraccion * precioLitro;
      if (montoCalculado > capacidad * precioLitro) {
        alert(`El monto calculado (${montoCalculado.toFixed(2)} Bs) excede la capacidad para un ${tipoVehiculo}.`);
        return;
      }
    }

    const codigo = form.numero.value;

    const nuevoTicket = {
      codigo,
      tipoVehiculo,
      hora: horaSeleccionada,
      fechaProgramada,
      fechaReserva,
      monto,
      fraccion,
      surtidor: surtidor.nombre,
      zona: surtidor.zona,
      nombreReservante
    };

    if (self.ticketEditando) {
      // Actualizar ticket existente
      const { surtidorNombre, index } = self.ticketEditando;
      self.ticketsPorSurtidor[surtidorNombre][index] = nuevoTicket;
      alert(`Ticket ${codigo} actualizado.`);
    } else {
      // Crear ticket nuevo
      self.ticketsPorSurtidor[surtidor.nombre].push(nuevoTicket);
      alert(`Ticket ${codigo} generado para ${surtidor.nombre}.`);
    }

    self.ticketEditando = null;
    modal.classList.add("oculto");
    self.mostrarSurtidores();
  };

  document.getElementById("cancelar-ticket").onclick = () => {
    modal.classList.add("oculto");
    self.ticketEditando = null;
  };
}

validarMontoYFraccion(monto, fraccion) {
  return (monto && fraccion) || (!monto && !fraccion);
}

validarNombre(nombre) {
  return nombre.trim().length > 0;
}

generarCodigoTicket(surtidor) {
  // 20 % del total de litros como límite
  const maxTickets = Math.floor(Number(surtidor.litros) * 0.2);
  const emitidos   = this.ticketsPorSurtidor[surtidor.nombre]?.length || 0;

  if (emitidos >= maxTickets) {
    throw new Error(`Límite de tickets alcanzado para ${surtidor.nombre}`);
  }

  const codigo = `T-${(emitidos + 1).toString().padStart(4, '0')}`;
  return codigo;
}

editarTicket(surtidorNombre, index) {
  const ticket = this.ticketsPorSurtidor[surtidorNombre][index];
  const surtidor = this.conductor.obtenerSurtidorPorNombre(surtidorNombre);
  this.mostrarFormularioTicket(surtidor, ticket, index);
}


eliminarTicket(surtidorNombre, index) {
  this.ticketsPorSurtidor[surtidorNombre].splice(index, 1);
  alert("Ticket eliminado");
  this.mostrarSurtidores(); // para actualizar el contador de tickets
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
  const resultado = this.obtenerProbabilidadCarga(nombre);
  console.log('Resultado obtenerProbabilidadCarga:', resultado);
  if (!resultado) {
    alert('No se pudo calcular la probabilidad');
    return;
  }
  const { porcentaje, autosQuePodranCargar } = resultado;
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
  const surtidor = this.conductor.obtenerSurtidorPorNombre(nombre);
  if (!surtidor) {
    console.warn(`Surtidor con nombre "${nombre}" no encontrado.`);
    return { porcentaje: 0, autosQuePodranCargar: 0 };
  }

  const tipoAuto = this.selectTipoAuto?.value || 'grande';
  const autosEsperando = Number(surtidor.fila);

  const resultado = calcularProbabilidadCarga({
    combustibleDisponible: surtidor.litros,
    autosEsperando,
    tipoAuto
  });

  console.log('Resultado calcularProbabilidadCarga:', resultado);

  if (!resultado) {
    console.error('calcularProbabilidadCarga retornó undefined o null');
    return { porcentaje: 0, autosQuePodranCargar: 0 };
  }

  return resultado;
}


calcularProbabilidadParaSurtidorConTipo(nombre, tipoAuto) {
  const surtidor = this.conductor.obtenerSurtidorPorNombre(nombre);
  if (!surtidor) return { porcentaje: 0, autosQuePodranCargar: 0 };

  const autosEsperando = Number(surtidor.fila);

  return calcularProbabilidadCarga({
    combustibleDisponible: surtidor.litros,
    autosEsperando,
    tipoAuto
  });
}

obtenerTipoAuto() {
  return 'grande';
}

getLitrosOriginal(surtidor) {
  return surtidor.litrosOriginal ?? surtidor.litros;
}

  generarTicket() {
    const estacion = document.getElementById('inputEstacion').value.trim();
    const tipoCombustible = document.getElementById('inputCombustible').value.trim();
  
    if (!estacion || !tipoCombustible) {
      alert('Por favor, ingresa estación y tipo de combustible.');
      return;
    }
  
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
  this.selectTipoAuto = document.getElementById('ticket-vehiculo');
  this.mostrarSurtidores();
  this.manejarFormulario();
  this.manejarToggle();
  this.manejarFiltroZona();
  this.manejarBusquedaNombre();
  this.manejarEdicion();
  this.manejarOrdenacion();
  this.manejarSeleccionSurtidor();
  this.manejarCalculoProbabilidad(); 
  }
}
 