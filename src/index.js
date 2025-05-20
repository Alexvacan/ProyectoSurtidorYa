import { Presenter } from './presenter.js';
import { calcularProbabilidadCarga } from './probabilidadCargaService.js';

let presenter;
window.addEventListener('DOMContentLoaded', () => {
  const presenter = new Presenter();
  presenter.inicializar();

  const select = document.getElementById('surtidor-seleccionado');
  const btnGenerarTicket = document.getElementById('btn-generar-ticket');
  const ticketTextarea = document.getElementById('ticket-textarea');

  document.getElementById('calcular-probabilidad').addEventListener('click', () => {
    const nombreSeleccionado = select.value;

    const surtidor = surtidores.find(s => s.nombre === nombreSeleccionado);
    if (!surtidor) {
      alert('Surtidor no encontrado');
      return;
    }

    const tipoAuto = 'pequeno'; // Puedes hacerlo dinámico si quieres más adelante
    const resultado = calcularProbabilidadCarga({
      combustibleDisponible: surtidor.litros,
      autosEsperando: surtidor.fila,
      tipoAuto
    });

    document.getElementById('texto-probabilidad').innerText =
      `Probabilidad: ${resultado.porcentaje.toFixed(2)}%. Autos que podrán cargar: ${resultado.autosQuePodranCargar}`;
  });

  btnGenerarTicket.addEventListener('click', () => {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();

    const ticket = `🎫 Ticket generado
    Fecha: ${fecha}
    Hora: ${hora}
    -----------------------------\n`;

    ticketTextarea.value += ticket;
  });
  document.getElementById('btn-ver-ticket').addEventListener('click', () => {
  const nombreSeleccionado = document.getElementById('surtidor-seleccionado').value;
  const surtidor = presenter.conductor.obtenerSurtidorPorNombre(nombreSeleccionado);

  if (!surtidor) {
    alert('No se encontró el surtidor');
    return;
  }

  try {
    const ticket = presenter.conductor.generarTicket(surtidor);
    document.getElementById('ticket-textarea').value = ticket;
  } catch (e) {
    alert('Error al generar el ticket: ' + e.message);
  }
});


});
