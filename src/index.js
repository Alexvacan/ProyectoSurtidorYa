console.log('El proyecto se ha cargado correctamente.');

import { Presenter } from './presenter.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('Hola, el proyecto se ha cargado correctamente');
  const presenter = new Presenter();
  presenter.inicializar();
});
// Nueva funcionalidad: Gestión inteligente de reabastecimiento
class GestorReabastecimiento {
  constructor() {
    this.surtidores = [];
    this.intervaloVerificacion = setInterval(() => this.verificarEstadoSurtidores(), 60000); // Verifica cada minuto
  }

  agregarSurtidor(surtidor) {
    this.surtidores.push({
      ...surtidor,
      proximoReabastecimiento: this.calcularProximoReabastecimiento(surtidor)
    });
    this.actualizarInterfaz();
  }

  calcularProximoReabastecimiento({ horaReabastecimiento, litros }) {
    const [horas, minutos] = horaReabastecimiento.split(':').map(Number);
    const ahora = new Date();
    const fechaBase = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      horas,
      minutos
    );
    
    // Calcular fecha próxima considerando litros disponibles
    const factorConsumo = 100; // Litros consumidos por hora (ajustable)
    const horasHastaReab = litros / factorConsumo;
    return new Date(fechaBase.getTime() + horasHastaReab * 3600000);
  }

  verificarEstadoSurtidores() {
    this.surtidores.forEach((surtidor, index) => {
      const tiempoRestante = surtidor.proximoReabastecimiento - new Date();
      
      if (tiempoRestante <= 0) {
        this.mostrarNotificacion(`¡Surtidor ${surtidor.nombre} necesita reabastecerse!`);
        this.actualizarEstadoSurtidor(index, 'Sin gasolina');
      } else if (tiempoRestante <= 3600000) { // 1 hora antes
        this.mostrarNotificacion(`Aviso: Surtidor ${surtidor.nombre} necesita reabastecimiento en ${Math.ceil(tiempoRestante / 60000)} minutos`);
      }
    });
  }

  actualizarEstadoSurtidor(index, nuevoEstado) {
    this.surtidores[index].estado = nuevoEstado;
    this.actualizarInterfaz();
  }

  mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 5000);
  }

  actualizarInterfaz() {
    const lista = document.getElementById('lista-surtidores');
    lista.innerHTML = this.surtidores.map(surtidor => `
      <li data-estado="${surtidor.estado}">
        <strong>${surtidor.nombre}</strong>
        <span>Estado: ${surtidor.estado}</span>
        <span>Próximo reabastecimiento: ${surtidor.proximoReabastecimiento.toLocaleTimeString()}</span>
      </li>
    `).join('');
  }
}

// Integración con el código existente
document.addEventListener('DOMContentLoaded', () => {
  const gestor = new GestorReabastecimiento();

  // Modificar el manejador de formulario existente
  document.getElementById('form-surtidor').addEventListener('submit', e => {
    e.preventDefault();
    
    const nuevoSurtidor = {
      nombre: document.getElementById('nombre').value,
      estado: document.getElementById('estado').value,
      fila: parseInt(document.getElementById('fila').value),
      zona: document.getElementById('zona').value,
      litros: parseInt(document.getElementById('litros').value),
      horaReabastecimiento: document.getElementById('hora-reabastecimiento').value
    };

    gestor.agregarSurtidor(nuevoSurtidor);
  });

  // Modificar la función de edición
  document.getElementById('guardar-edicion').addEventListener('click', () => {
    const datosActualizados = {
      nombre: document.getElementById('editar-nombre').value,
      estado: document.getElementById('editar-estado').value,
      litros: parseInt(document.getElementById('editar-litros').value),
      horaReabastecimiento: document.getElementById('editar-hora-reabastecimiento').value
    };
    
    // Lógica para actualizar el surtidor en el gestor
    gestor.actualizarSurtidor(indiceEdicion, datosActualizados);
  });
});
