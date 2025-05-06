import { Presenter } from './presenter.js';
import { calcularProbabilidadCarga } from './probabilidadCargaService.js';

window.addEventListener('DOMContentLoaded', () => {
  const presenter = new Presenter();
  presenter.inicializar();
});

document.getElementById('calcular-probabilidad').addEventListener('click', () => {
  const select = document.getElementById('surtidor-seleccionado');
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
