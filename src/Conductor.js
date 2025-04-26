export class Conductor {
    constructor() {
      const guardados = localStorage.getItem('surtidores');
      this.surtidores = guardados
        ? JSON.parse(guardados)
        : [
            { nombre: 'Surtidor A', estado: 'Disponible', fila: 5, zona: 'Cercado', litros: 12000},
            { nombre: 'Surtidor B', estado: 'Sin gasolina', fila: 0, zona: 'Pacata', litros: 0 },
            { nombre: 'Surtidor C', estado: 'Disponible', fila: 2, zona: 'Quillacollo', litros: 8000 }
          ];
    }
  
    listaSurtidores() {
      return this.surtidores;
    }
  
    agregarSurtidor(nombre, estado, fila, zona, litros) {
      this.surtidores.push({
        nombre,
        estado: estado.trim(),
        fila: parseInt(fila),
        zona,
        litros: parseInt(litros)
      });
      this.guardarEnLocalStorage();
    }
  
    eliminarSurtidor(nombre) {
      this.surtidores = this.surtidores.filter(s => s.nombre !== nombre);
      this.guardarEnLocalStorage();
    }
  
    editarSurtidor(nombreOriginal, nuevoNombre, nuevoEstado, nuevaFila, nuevaZona, nuevosLitros) {
      const surtidor = this.surtidores.find(s => s.nombre === nombreOriginal);
      if (surtidor) {
        surtidor.nombre = nuevoNombre;
        surtidor.estado = nuevoEstado;
        surtidor.fila = parseInt(nuevaFila);
        surtidor.zona = nuevaZona;
        surtidor.litros = parseInt(nuevosLitros);
        this.guardarEnLocalStorage();
      }
    } 

    nivelGasolina(litros) {
      if (litros > 10000)
        return 'Alto';
      if (litros >= 5000 && litros <= 10000) 
        return 'Medio';
      if (litros <= 5000 && litros > 0)
        return 'Bajo';
      else return 'Sin gasolina';
    }
  
    guardarEnLocalStorage() {
      localStorage.setItem('surtidores', JSON.stringify(this.surtidores));
    }
  }
  