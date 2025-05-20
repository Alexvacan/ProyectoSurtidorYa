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

  agregarSurtidor(data) {
    if (typeof data !== 'object') {
      throw new Error('agregarSurtidor: se esperaba un objeto');
    }
  
    const {
      nombre, direccion, estado, fila, zona,
      litros, apertura, cierre, contacto
    } = data;
  
    if (!nombre || !zona || !litros || !apertura || !cierre || !contacto) {
      throw new Error('agregarSurtidor: datos incompletos');
    }
  
    const surtidor = {
      nombre,
      direccion,
      estado: String(estado).trim(),
      fila: parseInt(fila, 10),
      zona,
      litros: parseInt(litros, 10),
      apertura,
      cierre,
      contacto
    };
    this.surtidores.push(surtidor);
    this.guardarEnLocalStorage();
  }

  eliminarSurtidor(nombre) {  
    this.surtidores = this.surtidores.filter(s => s.nombre !== nombre);
    this.guardarEnLocalStorage();
  }

  editarSurtidor(nombreOriginal, ...args) {
    const s = this.surtidores.find(x => x.nombre === nombreOriginal);
    if (!s) return;
  
    let [nuevoNombre, nuevaDireccion, nuevoEstado, nuevaFila, nuevaZona, nuevosLitros, nuevaApertura, nuevoCierre, nuevoContacto] = [];
  
    if (args.length === 4) {
      // Firma simple: nombre, estado, fila, zona
      [nuevoNombre, nuevoEstado, nuevaFila, nuevaZona] = args;
      nuevaDireccion = s.direccion;
      nuevosLitros   = s.litros;
      nuevaApertura  = s.apertura;
      nuevoCierre    = s.cierre;
      nuevoContacto  = s.contacto;
    }
    else if (args.length === 8) {
      // Firma intermedia sin dirección
      [nuevoNombre, nuevoEstado, nuevaFila, nuevaZona, nuevosLitros, nuevaApertura, nuevoCierre, nuevoContacto] = args;
      nuevaDireccion = s.direccion;
    }
    else if (args.length === 9) {
      // Firma completa con dirección
      [nuevoNombre, nuevaDireccion, nuevoEstado, nuevaFila, nuevaZona, nuevosLitros, nuevaApertura, nuevoCierre, nuevoContacto] = args;
    } else {
      throw new Error('editarSurtidor: parámetros inválidos');
    }
  
    s.nombre    = nuevoNombre;
    s.direccion = nuevaDireccion;
    s.estado    = String(nuevoEstado).trim();
    s.fila      = parseInt(nuevaFila, 10);
    s.zona      = nuevaZona;
    s.litros    = parseInt(nuevosLitros, 10);
    s.apertura  = nuevaApertura;
    s.cierre    = nuevoCierre;
    s.contacto  = nuevoContacto;
  
    this.guardarEnLocalStorage();
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

  generarTicket(surtidor) {
  if (typeof surtidor !== 'object' || !surtidor.nombre || !surtidor.litros) {
    throw new Error('generarTicket: datos inválidos');
  }

  const fecha = new Date().toLocaleString();
  return `
    *** TICKET DE SURTIDOR ***
    Nombre: ${surtidor.nombre}
    Zona: ${surtidor.zona}
    Litros disponibles: ${surtidor.litros}
    Horario: ${surtidor.apertura} - ${surtidor.cierre}
    Fecha emisión: ${fecha}
    ----------------------------
  `;
}

}
