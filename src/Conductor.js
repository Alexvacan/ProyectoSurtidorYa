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
            horarioApertura: '06:00',
            horarioCierre: '22:00',
            contacto: '77711122',
            horarioEspecial: '',
            festivo: false
          },
          {
            nombre: 'Surtidor B',
            direccion: 'Calle Cochabamba 5678, Pacata',
            estado: 'Sin gasolina',
            fila: 0,
            zona: 'Pacata',
            litros: 0,
            horarioApertura: '07:00',
            horarioCierre: '21:00',
            contacto: '78889999',
            horarioEspecial: '',
            festivo: false
          },
          {
            nombre: 'Surtidor C',
            direccion: 'Av. libertad 9012, Quillacollo',
            estado: 'Disponible',
            fila: 2,
            zona: 'Quillacollo',
            litros: 8000,
            horarioApertura: '05:30',
            horarioCierre: '20:30',
            contacto: '79998877',
            horarioEspecial: '',
            festivo: false
          }
        ];
  }

  listaSurtidores() {
    return this.surtidores;
  }

  agregarSurtidor(...args) {
    let nombre, direccion, estado, fila, zona, litros, horarioApertura, horarioCierre, contacto;
  
    if (args.length === 8) {
      // Firma antigua: nombre, estado, fila, zona, litros, horarioApertura, horarioCierre, contacto
      [nombre, estado, fila, zona, litros, horarioApertura, horarioCierre, contacto] = args;
      direccion = '';
    } else {
      // Firma nueva: nombre, direccion, estado, fila, zona, litros, horarioApertura, horarioCierre, contacto
      [nombre, direccion, estado, fila, zona, litros, horarioApertura, horarioCierre, contacto] = args;
    }
  
    this.surtidores.push({
      nombre,
      direccion,
      estado: String(estado).trim(),
      fila: parseInt(fila, 10),
      zona,
      litros: parseInt(litros, 10),
      horarioApertura,
      horarioCierre,
      contacto
    });
    this.guardarEnLocalStorage();
  }
  

  eliminarSurtidor(nombre) {
    this.surtidores = this.surtidores.filter(s => s.nombre !== nombre);
    this.guardarEnLocalStorage();
  }

  editarSurtidor(nombreOriginal, ...args) {
    const s = this.surtidores.find(x => x.nombre === nombreOriginal);
    if (!s) return;
  
    let [nuevoNombre, nuevaDireccion, nuevoEstado, nuevaFila, nuevaZona, nuevosLitros, nuevoHorA, nuevoHorC, nuevoContacto] = [];
  
    if (args.length === 4) {
      // tests básicos: nombre, estado, fila, zona
      [nuevoNombre, nuevoEstado, nuevaFila, nuevaZona] = args;
      nuevaDireccion = s.direccion;
      nuevosLitros   = s.litros;
      nuevoHorA      = s.horarioApertura;
      nuevoHorC      = s.horarioCierre;
      nuevoContacto  = s.contacto;
    }
    else if (args.length === 8) {
      // tests con litros/horarios/contacto (8 args)
      [nuevoNombre, nuevoEstado, nuevaFila, nuevaZona, nuevosLitros, nuevoHorA, nuevoHorC, nuevoContacto] = args;
      nuevaDireccion = s.direccion;
    }
    else if (args.length === 9) {
      // firma completa con dirección (9 args)
      [nuevoNombre, nuevaDireccion, nuevoEstado, nuevaFila, nuevaZona, nuevosLitros, nuevoHorA, nuevoHorC, nuevoContacto] = args;
    } else {
      throw new Error('editarSurtidor: parámetros inválidos');
    }
  
    s.nombre          = nuevoNombre;
    s.direccion       = nuevaDireccion;
    s.estado          = String(nuevoEstado).trim();
    s.fila            = parseInt(nuevaFila, 10);
    s.zona            = nuevaZona;
    s.litros          = parseInt(nuevosLitros, 10);
    s.horarioApertura = nuevoHorA;
    s.horarioCierre   = nuevoHorC;
    s.contacto        = nuevoContacto;
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
}
