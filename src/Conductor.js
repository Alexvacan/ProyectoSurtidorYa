export class Conductor {
    constructor() {
      this.surtidores = [
        { nombre: 'Surtidor A', estado: 'Disponible', fila: 5 },
        { nombre: 'Surtidor B', estado: 'Sin gasolina', fila: 0 },
        { nombre: 'Surtidor C', estado: 'Disponible', fila: 2 }
      ];
    }
  
    listaSurtidores() {
      return this.surtidores;
    }
  
    agregarSurtidor(nombre, estado, fila) {
      this.surtidores.push({ nombre, estado, fila: parseInt(fila) });
    }
  }
  