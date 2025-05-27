import { Conductor } from './Conductor.js';
import { Presenter } from './presenter.js';
import { calcularProbabilidadCarga } from './probabilidadCargaService.js';

let presenter;

window.addEventListener('DOMContentLoaded', () => {
  
  presenter = new Presenter();
  presenter.inicializar();
  document.getElementById("cerrar-modal-ver-tickets").addEventListener("click", () => {
  document.getElementById("modal-ver-tickets").classList.add("oculto");
});
document.getElementById("btn-ver-ticket").addEventListener("click", () => {
    document.getElementById("modal-ver-tickets").classList.remove("oculto");

    const tickets = conductor.obtenerTodosLosTickets(); // <- asegúrate de tener este método
    renderizarTickets(tickets); // <- define esta función también
  });

  // Input para filtrar
  document.getElementById("buscar-ticket").addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const ticketsFiltrados = conductor.obtenerTodosLosTickets().filter(ticket =>
      ticket.codigo.toLowerCase().includes(texto) ||
      ticket.nombreReservante.toLowerCase().includes(texto)
    );
    renderizarTickets(ticketsFiltrados);
  });

  const select = document.getElementById('surtidor-seleccionado');
  const btnGenerarTicket = document.getElementById('btn-generar-ticket');
  const ticketTextarea = document.getElementById('ticket-textarea');
  

  document.getElementById('calcular-probabilidad').addEventListener('click', () => {
  const nombreSeleccionado = select.value;
  const resultado = presenter.obtenerProbabilidadCarga(nombreSeleccionado);

  if (!resultado) {
    alert('No se pudo calcular la probabilidad');
    return;
  }

  // Evita destructuring directo sin validar
  const porcentaje = resultado.porcentaje ?? 0;
  const autosQuePodranCargar = resultado.autosQuePodranCargar ?? 0;

  document.getElementById('texto-probabilidad').innerText =
    `Probabilidad: ${porcentaje.toFixed(2)}%. Autos que podrán cargar: ${autosQuePodranCargar}`;
});


  btnGenerarTicket.addEventListener('click', () => {
    const surtidores = presenter.conductor.listaSurtidores();

    if (surtidores.length === 0) {
      ticketTextarea.value += 'No hay surtidores para generar ticket.\n';
      return;
    }

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();

    const surtidor = surtidores[0]; // puedes usar otra lógica para elegirlo
    const estacion = "Mi Estación";
    const tipoCombustible = "Gasolina";

    const ticket = `
🎫 Ticket generado
Estación: ${estacion}
Surtidor: ${surtidor.nombre}
Zona: ${surtidor.zona}
Tipo de combustible: ${tipoCombustible}
Horario: ${surtidor.apertura} - ${surtidor.cierre}
Litros disponibles: ${surtidor.litros}
Fecha: ${fecha}
Hora: ${hora}
-----------------------------\n`;

    ticketTextarea.value += ticket;
  });

  document.getElementById('btn-ver-ticket').addEventListener('click', () => {
    document.getElementById("modal-ver-tickets").classList.remove("oculto");
    const todosLosTickets = conductor.obtenerTodosLosTickets(); // Este método lo definiremos abajo
  renderizarTickets(todosLosTickets);
    const nombreSeleccionado = document.getElementById('surtidor-seleccionado').value;
    const surtidor = presenter.conductor.obtenerSurtidorPorNombre(nombreSeleccionado);

    if (!surtidor) {
      alert('No se encontró el surtidor');
      return;
    }

    try {
      const estacion = "Mi Estación";
      const tipoCombustible = "Gasolina";
      const ticket = presenter.conductor.generarTicket(estacion, surtidor, tipoCombustible);
      document.getElementById('ticket-textarea').value = ticket;
    } catch (e) {
      alert('Error al generar el ticket: ' + e.message);
    }
  });

  function renderizarSurtidores(surtidores) {
    const lista = document.getElementById("lista-surtidores");
    lista.innerHTML = "";

    surtidores.forEach(surtidor => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${surtidor.nombre}</strong> - ${surtidor.estado} - ${surtidor.zona}
        <button class="btn-ver-ticket" data-nombre="${surtidor.nombre}">Ver tickets</button>
      `;

      lista.appendChild(li);
    });
  }

  function generarHorariosDisponibles() {
    const horarios = [];
    for (let h = 0; h < 24; h++) {
      horarios.push(`${h.toString().padStart(2, '0')}:00`);
      horarios.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return horarios;
  }

  function mostrarTicketsDelSurtidor(nombreSurtidor) {
    const tickets = presenter.conductor.obtenerTicketsPorSurtidor(nombreSurtidor);
    const contenedor = document.getElementById('contenedor-ver-tickets');
    const lista = document.getElementById('lista-tickets');
    const input = document.getElementById('buscar-ticket');

    lista.innerHTML = '';
    input.value = '';
    contenedor.style.display = 'block';

    const renderTickets = (filtro = '') => {
      lista.innerHTML = '';
      const filtrados = tickets.filter(t =>
        t.codigo.includes(filtro) || t.nombreReservante.toLowerCase().includes(filtro.toLowerCase())
      );

      if (filtrados.length === 0) {
        lista.innerHTML = '<p>No se encontraron tickets</p>';
      } else {
        filtrados.forEach(t => {
          const div = document.createElement('div');
          div.textContent = `🧾 Código: ${t.codigo}, Fecha: ${t.fechaReserva}, Nombre: ${t.nombreReservante}`;
          lista.appendChild(div);
        });
      }
    };

    input.addEventListener('input', e => renderTickets(e.target.value));
    renderTickets();
  }

  function renderizarTickets(tickets) {
  const contenedor = document.getElementById("contenedor-tickets");
  contenedor.innerHTML = ""; // Limpia contenido anterior

  if (tickets.length === 0) {
    contenedor.innerHTML = "<p>No hay tickets disponibles.</p>";
    return;
  }

  tickets.forEach(ticket => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerHTML = `
      <p><strong>Reservante:</strong> ${ticket.nombreReservante}</p>
      <p><strong>Código:</strong> ${ticket.codigo}</p>
      <p><strong>Fecha:</strong> ${ticket.fecha}</p>
      <p><strong>Monto:</strong> ${ticket.monto} Bs</p>
      <hr>
    `;
    contenedor.appendChild(div);
  });
}

document.getElementById("buscar-ticket").addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();
  const ticketsFiltrados = conductor.obtenerTodosLosTickets().filter(ticket =>
    ticket.codigo.toLowerCase().includes(texto) ||
    ticket.nombreReservante.toLowerCase().includes(texto)
  );
  renderizarTickets(ticketsFiltrados);
});

// === Lógica de cálculo de monto sugerido por tipo de vehículo ===
const precioLitro = 3.74;
const selectVehiculo = document.getElementById('ticket-vehiculo');
const fraccionInput = document.getElementById('ticket-fraccion');
const montoInput = document.getElementById('ticket-monto');

function calcularMontoMaximo() {
  const tipo = selectVehiculo.value;
  const fraccion = parseFloat(fraccionInput.value);

  let capacidad = 0;
  if (tipo === 'moto') capacidad = 22;
  else if (tipo === 'pequeno') capacidad = 52;
  else if (tipo === 'grande') capacidad = 85;

  if (capacidad > 0 && fraccion > 0) {
    const monto = Math.round(capacidad * fraccion * precioLitro);
    montoInput.value = monto;
    montoInput.max = monto;
  } else {
    montoInput.value = '';
  }
}

// Activar cálculo automático al cambiar tipo de vehículo o fracción
selectVehiculo?.addEventListener('change', calcularMontoMaximo);
fraccionInput?.addEventListener('input', calcularMontoMaximo);


});
