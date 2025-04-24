export class Conductor {
    constructor() {
      const guardados = localStorage.getItem('surtidores');
      this.surtidores = guardados
        ? JSON.parse(guardados)
        : [
            { nombre: 'Surtidor A', estado: 'Disponible', fila: 5, zona: 'Cercado' },
            { nombre: 'Surtidor B', estado: 'Sin gasolina', fila: 0, zona: 'Pacata' },
            { nombre: 'Surtidor C', estado: 'Disponible', fila: 2, zona: 'Quillacollo' }
          ];
    }
  
    listaSurtidores() {
      return this.surtidores;
    }
  
    agregarSurtidor(nombre, estado, fila, zona) {
      this.surtidores.push({
        nombre,
        estado: estado.trim(),
        fila: parseInt(fila),
        zona
      });
      this.guardarEnLocalStorage();
    }
  
    guardarEnLocalStorage() {
      localStorage.setItem('surtidores', JSON.stringify(this.surtidores));
    }
  }
  