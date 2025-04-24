import { Conductor } from './Conductor';

global.localStorage = {
    getItem: jest.fn(() => null), 
    setItem: jest.fn(),
  };

describe('Conductor', () => {
  it('debería retornar una lista de surtidores', () => {
    const conductor = new Conductor();
    const surtidores = conductor.listaSurtidores();
    
    expect(Array.isArray(surtidores)).toBe(true);
    expect(surtidores.length).toBeGreaterThan(0);
    expect(surtidores[0]).toHaveProperty('nombre');
    expect(surtidores[0]).toHaveProperty('estado');
    expect(surtidores[0]).toHaveProperty('fila');
  });

  it('debería guardar en localStorage al agregar un surtidor', () => {
    const conductor = new Conductor();
    conductor.agregarSurtidor('Nuevo', 'Disponible', 3);
    
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'surtidores',
      expect.stringContaining('Nuevo')
    );
  });

  describe('Conductor', () => {
    it('debería retornar una lista de surtidores con zona incluida', () => {
      const conductor = new Conductor();
      const surtidores = conductor.listaSurtidores();
      
      expect(Array.isArray(surtidores)).toBe(true);
      expect(surtidores.length).toBeGreaterThan(0);
      expect(surtidores[0]).toHaveProperty('nombre');
      expect(surtidores[0]).toHaveProperty('estado');
      expect(surtidores[0]).toHaveProperty('fila');
      expect(surtidores[0]).toHaveProperty('zona');
    });

    it('debería agregar un nuevo surtidor con zona', () => {
        const conductor = new Conductor();
        const largoAnterior = conductor.listaSurtidores().length;
        conductor.agregarSurtidor('Nuevo Surtidor', 'Disponible', 3, 'Tiquipaya');
        const surtidores = conductor.listaSurtidores();
        const ultimo = surtidores[surtidores.length - 1];
    
        expect(surtidores.length).toBeGreaterThan(largoAnterior);
        expect(ultimo.nombre).toBe('Nuevo Surtidor');
        expect(ultimo.estado).toBe('Disponible');
        expect(ultimo.fila).toBe(3);
        expect(ultimo.zona).toBe('Tiquipaya');
      });
  });
});
