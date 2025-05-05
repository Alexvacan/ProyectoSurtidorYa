import { TimeSlotService } from './timeSlotService.js';

describe('TimeSlotService', () => {
  it('debe exponer el método listarSlots', () => {
    expect(typeof TimeSlotService.listarSlots).toBe('function');
  });
});
