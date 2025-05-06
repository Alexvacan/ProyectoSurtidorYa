export class Conductor {
  constructor() {
    const guardados = localStorage.getItem('surtidores');
    this.surtidores = guardados
      ? JSON.parse(guardados)
      : [
          { 
            nombre: 'Surtidor A',
            direccion: 'Av. República 1234, Cercado',
            estado: 'Disponible',
            fila: 5,
            zona: 'Cercado',
            litros: 12000,
            apertura: '08:00',
            cierre: '20:00',
            contacto: '4444444'
          },
          {
            nombre: 'Surtidor B',
            direccion: 'Calle Cochabamba 5678, Pacata',
            estado: 'Sin gasolina',
            fila: 0,
            zona: 'Pacata',
            litros: 0,
            apertura: '07:30',
            cierre: '19:00',
            contacto: '7777777'
          },
          {
            nombre: 'Surtidor C',
            direccion: 'Av. libertad 9012, Quillacollo',
            estado: 'Disponible',
            fila: 2,
            zona: 'Quillacollo',
            litros: 8000,
            apertura: '06:00',
            cierre: '18:00',
            contacto: '6666666'
          }
        ];
  }

  listaSurtidores() {
    return this.surtidores;
  }

  agregarSurtidor(nombre, estado, fila, zona, litros, apertura, cierre, contacto) {
    this.surtidores.push({
      nombre,
      estado: estado.trim(),
      fila: parseInt(fila),
      zona,
      litros: parseInt(litros),
      apertura,
      cierre,
      contacto
    });
    this.guardarEnLocalStorage();
  }

  eliminarSurtidor(nombre) {
    this.surtidores = this.surtidores.filter(s => s.nombre !== nombre);
    this.guardarEnLocalStorage();
  }

  editarSurtidor(nombreOriginal, nuevoNombre, nuevoEstado, nuevaFila, nuevaZona, nuevosLitros, nuevaApertura, nuevoCierre, nuevoContacto)  {
    const surtidor = this.surtidores.find(s => s.nombre === nombreOriginal);
    if (surtidor) {
      surtidor.nombre = nuevoNombre;
      surtidor.estado = nuevoEstado;
      surtidor.fila = parseInt(nuevaFila);
      surtidor.zona = nuevaZona;
      surtidor.litros = parseInt(nuevosLitros);
      surtidor.apertura = nuevaApertura;
      surtidor.cierre = nuevoCierre;
      surtidor.contacto = nuevoContacto;
      this.guardarEnLocalStorage();
      }
  }

  nivelGasolina(litros) {
    if (litros > 10000) return 'Alto';
    if (litros >= 5000) return 'Medio';
    if (litros > 0) return 'Bajo';
    return 'Sin gasolina';
  }

  obtenerSurtidorPorNombre(nombre) {
    return this.surtidores.find(s => s.nombre === nombre) || null;
  }

  guardarEnLocalStorage() {
    localStorage.setItem('surtidores', JSON.stringify(this.surtidores));
  }
}
