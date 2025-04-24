export class Conductor {
    constructor() {
      const guardados = localStorage.getItem('surtidores');
      this.surtidores = guardados
        ? JSON.parse(guardados)
        : [
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
      this.guardarEnLocalStorage();
    }
  
    guardarEnLocalStorage() {
      localStorage.setItem('surtidores', JSON.stringify(this.surtidores));
    }
  }
  