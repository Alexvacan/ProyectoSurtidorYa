export class TimeSlotService {

    static listarSlots(surtidorNombre) {
      if (!surtidorNombre) {
        throw new Error('Se requiere nombre de surtidor');
      }
      // Genera de 06:00 a 22:00 en pasos de 30 minutos
      return TimeSlotService._generateSlots(6, 22, 30);
    }
    static _generateSlots(startHour, endHour, stepMin) {
      const slots = [];
      let hour = startHour;
      let min = 0;
  
      while (hour < endHour || (hour === endHour && min === 0)) {
        const h1 = String(hour).padStart(2, '0');
        const m1 = String(min).padStart(2, '0');
  
        const totalMin = hour * 60 + min + stepMin;
        const nextHour = Math.floor(totalMin / 60);
        const nextMin = totalMin % 60;
        const h2 = String(nextHour).padStart(2, '0');
        const m2 = String(nextMin).padStart(2, '0');
  
        slots.push({
          horaInicio: `${h1}:${m1}`,
          horaFin:    `${h2}:${m2}`,
          disponible: true
        });
  
        min += stepMin;
        if (min >= 60) {
          hour++;
          min -= 60;
        }
      }
  
      return slots;
    }
  }
  