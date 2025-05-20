import { Conductor } from './Conductor.js';
import { Presenter } from './presenter.js';
import { calcularProbabilidadCarga } from './probabilidadCargaService.js';

window.addEventListener('DOMContentLoaded', () => {
  const presenter = new Presenter();
  const conductor = new Conductor();
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
    const surtidores = conductor.listaSurtidores();
    if (surtidores.length === 0) {
      ticketTextarea.value += 'No hay surtidores para generar ticket.\n';
      return;
    }
    const surtidor = surtidores[0];
    const estacion = "Mi Estación";
    const tipoCombustible = "Gasolina";
    const ticket = conductor.generarTicket(estacion, surtidor, tipoCombustible);
    ticketTextarea.value += ticket + '\n';
  });
});
