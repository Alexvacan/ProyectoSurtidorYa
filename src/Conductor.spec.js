import { Conductor } from './Conductor';

global.localStorage = {
    getItem: jest.fn(() => null), // simulamos que no hay datos guardados
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
  
});
