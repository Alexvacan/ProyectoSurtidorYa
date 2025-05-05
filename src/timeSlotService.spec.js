import { TimeSlotService } from './timeSlotService.js';

describe('TimeSlotService', () => {
  it('debe exponer el método listarSlots', () => {
    expect(typeof TimeSlotService.listarSlots).toBe('function');
  });

  it('debe lanzar error si no se proporciona nombre de surtidor', () => {
    expect(() => TimeSlotService.listarSlots()).toThrow('Se requiere nombre de surtidor');
  });

  it('debe retornar array de franjas con horaInicio,horaFin y disponible', () => {
    const slots = TimeSlotService.listarSlots('Surtidor A');
    expect(Array.isArray(slots)).toBe(true);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toEqual(expect.objectContaining({
      horaInicio: expect.any(String),
      horaFin:    expect.any(String),
      disponible: expect.any(Boolean)
    }));
  });

  it('debe generar franjas de 30 minutos desde las 06:00 hasta las 22:00', () => {
    const slots = TimeSlotService.listarSlots('Gasolinera X');
    // Primera franja
    expect(slots[0].horaInicio).toBe('06:00');
    expect(slots[0].horaFin).toBe('06:30');
    // Última franja
    const last = slots[slots.length - 1];
    expect(last.horaInicio).toBe('22:00');
    expect(last.horaFin).toBe('22:30');
  });
});
