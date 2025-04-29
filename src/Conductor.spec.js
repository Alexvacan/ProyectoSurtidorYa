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
    conductor.agregarSurtidor('Nuevo', 'Disponible', 3, 'Cercado', 1000, '06:00', '22:00', '77777777');

    
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

      it('debería filtrar surtidores por nombre', () => {
        const conductor = new Conductor();
        conductor.agregarSurtidor('Mi Surtidor Especial', 'Disponible', 1, 'Cercado');
        const resultado = conductor.listaSurtidores().filter(s => s.nombre.includes('Especial'));
        expect(resultado.length).toBeGreaterThan(0);
        expect(resultado[0].nombre).toContain('Especial');
      });

      it('debería eliminar un surtidor por nombre', () => {
        const conductor = new Conductor();
        conductor.agregarSurtidor('Temporal', 'Disponible', 0, 'Cercado');
        conductor.eliminarSurtidor('Temporal');
        const resultado = conductor.listaSurtidores().filter(s => s.nombre === 'Temporal');
        expect(resultado.length).toBe(0);
      });

      it('debería editar un surtidor existente', () => {
        const conductor = new Conductor();
      
        conductor.agregarSurtidor('Estación X', 'Disponible', 2, 'Cercado');
        conductor.editarSurtidor('Estación X', 'Estación Editada', 'Sin gasolina', 4, 'Pacata');
      
        const surtidor = conductor.listaSurtidores().find(s => s.nombre === 'Estación Editada');
      
        expect(surtidor).toBeDefined();
        expect(surtidor.estado).toBe('Sin gasolina');
        expect(surtidor.fila).toBe(4);
        expect(surtidor.zona).toBe('Pacata');
      });      

      it('debería retornar el nivel correcto de gasolina', () => {
        const conductor = new Conductor();
    
        expect(conductor.nivelGasolina(10200)).toBe('Alto');
        expect(conductor.nivelGasolina(7000)).toBe('Medio');
        expect(conductor.nivelGasolina(6500)).toBe('Medio');
        expect(conductor.nivelGasolina(3000)).toBe('Bajo');
        expect(conductor.nivelGasolina(15)).toBe('Bajo');
        expect(conductor.nivelGasolina(0)).toBe('Sin gasolina');
      });    
      
      it('debería agregar un surtidor incluyendo horario y contacto', () => {
        const conductor = new Conductor();
        conductor.agregarSurtidor('Surtidor Test', 'Disponible', 5, 'Pacata', 9000, '06:00', '22:00', '71112222');
        
        const surtidor = conductor.listaSurtidores().find(s => s.nombre === 'Surtidor Test');
        expect(surtidor).toBeDefined();
        expect(surtidor.horarioApertura).toBe('06:00');
        expect(surtidor.horarioCierre).toBe('22:00');
        expect(surtidor.contacto).toBe('71112222');
      });

      it('debería editar horario y contacto de un surtidor existente', () => {
        const conductor = new Conductor();
        conductor.agregarSurtidor('Surtidor Edit', 'Disponible', 2, 'Quillacollo', 8000, '07:00', '21:00', '70000000');
      
        conductor.editarSurtidor('Surtidor Edit', 'Surtidor Editado', 'Sin gasolina', 3, 'Cercado', 5000, '08:00', '20:00', '73333333');
      
        const surtidor = conductor.listaSurtidores().find(s => s.nombre === 'Surtidor Editado');
        expect(surtidor).toBeDefined();
        expect(surtidor.horarioApertura).toBe('08:00');
        expect(surtidor.horarioCierre).toBe('20:00');
        expect(surtidor.contacto).toBe('73333333');
      });

      
      it('debería guardar en localStorage después de eliminar un surtidor', () => {
        const conductor = new Conductor();
        conductor.agregarSurtidor('Surtidor Temporal', 'Disponible', 0, 'Pacata', 4000, '05:00', '18:00', '72222222');
        conductor.eliminarSurtidor('Surtidor Temporal');
        
        expect(localStorage.setItem).toHaveBeenCalled();
      });
      
      
  });
});
