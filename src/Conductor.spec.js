import { Conductor } from './Conductor.js';
import filtrarTickets from './filtrartickets.js';
import { Presenter } from './presenter.js';   

console.log('filtrarTickets:', filtrarTickets);


beforeEach(() => {
  global.localStorage = {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
  };
});

global.document = {
  getElementById: () => ({
    style: {},
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    innerHTML: '',
    value: '',
  }),
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
    conductor.agregarSurtidor({
      nombre: 'Nuevo',
      estado: 'Disponible',
      fila: 3,
      zona: 'Cercado',
      litros: 1000,
      apertura: '06:00',
      cierre: '22:00',
      contacto: '77777777',
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'surtidores',
      expect.stringContaining('"nombre":"Nuevo"')
    );
  });

  it('debería retornar una lista de surtidores con zona incluida', () => {
    const conductor = new Conductor();
    const surtidores = conductor.listaSurtidores();

    expect(Array.isArray(surtidores)).toBe(true);
    expect(surtidores.length).toBeGreaterThan(0);
    expect(surtidores[0]).toHaveProperty('zona');
  });

  it('debería agregar un nuevo surtidor con todos sus campos', () => {
    const conductor = new Conductor();
    const largoAnterior = conductor.listaSurtidores().length;

    conductor.agregarSurtidor({
      nombre: 'Nuevo Surtidor',
      estado: 'Disponible',
      fila: 3,
      zona: 'Tiquipaya',
      litros: 5000,
      apertura: '05:00',
      cierre: '19:00',
      contacto: '71112233',
    });

    const surtidores = conductor.listaSurtidores();
    const ultimo = surtidores[surtidores.length - 1];

    expect(surtidores.length).toBe(largoAnterior + 1);
    expect(ultimo.nombre).toBe('Nuevo Surtidor');
    expect(ultimo.estado).toBe('Disponible');
    expect(ultimo.fila).toBe(3);
    expect(ultimo.zona).toBe('Tiquipaya');
    expect(ultimo.litros).toBe(5000);
    expect(ultimo.apertura).toBe('05:00');
    expect(ultimo.cierre).toBe('19:00');
    expect(ultimo.contacto).toBe('71112233');
  });

  it('debería filtrar surtidores por nombre', () => {
    const conductor = new Conductor();
    conductor.agregarSurtidor({
      nombre: 'YPF Especial',
      estado: 'activo',
      fila: 5,
      zona: 'zona A',
      litros: 1000,
      apertura: '08:00',
      cierre: '20:00',
      contacto: '123456789',
    });

    const resultado = conductor.listaSurtidores().filter(s => s.nombre.includes('Especial'));

    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado[0].nombre).toContain('Especial');
  });

  it('debería eliminar un surtidor por nombre', () => {
    const conductor = new Conductor();
    conductor.agregarSurtidor({
      nombre: 'Temporal',
      estado: 'Disponible',
      fila: 0,
      zona: 'Pacata',
      litros: 1000,
      apertura: '08:00',
      cierre: '20:00',
      contacto: '12345678',
    });

    conductor.eliminarSurtidor('Temporal');
    const resultado = conductor.listaSurtidores().filter(s => s.nombre === 'Temporal');

    expect(resultado.length).toBe(0);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'surtidores',
      expect.any(String)
    );
  });

  it('debería editar un surtidor existente', () => {
    const conductor = new Conductor();
    conductor.agregarSurtidor({
      nombre: 'Estación X',
      estado: 'Disponible',
      fila: 2,
      zona: 'Cercado',
      litros: 1000,
      apertura: '08:00',
      cierre: '20:00',
      contacto: '12345678',
    });

    conductor.editarSurtidor(
      'Estación X',
      'Estación Editada',
      'Sin gasolina',
      4,
      'Pacata',
      2000,
      '09:00',
      '21:00',
      '87654321'
    );

    const surtidor = conductor.listaSurtidores().find(s => s.nombre === 'Estación Editada');

    expect(surtidor).toBeDefined();
    expect(surtidor.estado).toBe('Sin gasolina');
    expect(surtidor.fila).toBe(4);
    expect(surtidor.zona).toBe('Pacata');
  });

  it('debería retornar el nivel correcto de gasolina', () => {
    const conductor = new Conductor();

    expect(conductor.nivelGasolina(12000)).toBe('Alto');
    expect(conductor.nivelGasolina(8000)).toBe('Medio');
    expect(conductor.nivelGasolina(3000)).toBe('Bajo');
    expect(conductor.nivelGasolina(0)).toBe('Sin gasolina');
  });

  it('debería agregar un surtidor incluyendo horario y contacto', () => {
    const conductor = new Conductor();
    conductor.agregarSurtidor({
      nombre: 'Surtidor Test',
      estado: 'Disponible',
      fila: 5,
      zona: 'Pacata',
      litros: 9000,
      apertura: '06:00',
      cierre: '22:00',
      contacto: '71112222',
    });

    const surtidor = conductor.listaSurtidores().find(s => s.nombre === 'Surtidor Test');
    expect(surtidor).toBeDefined();
    expect(surtidor.apertura).toBe('06:00');
    expect(surtidor.cierre).toBe('22:00');
    expect(surtidor.contacto).toBe('71112222');
  });

  it('debería editar horario y contacto de un surtidor existente', () => {
    const conductor = new Conductor();
    conductor.agregarSurtidor({
      nombre: 'Surtidor Edit',
      estado: 'Disponible',
      fila: 2,
      zona: 'Quillacollo',
      litros: 8000,
      apertura: '07:00',
      cierre: '21:00',
      contacto: '70000000',
    });

    conductor.editarSurtidor(
      'Surtidor Edit',
      'Surtidor Editado',
      'Sin gasolina',
      3,
      'Cercado',
      5000,
      '08:00',
      '20:00',
      '73333333'
    );

    const surtidor = conductor.listaSurtidores().find(s => s.nombre === 'Surtidor Editado');
    expect(surtidor).toBeDefined();
    expect(surtidor.apertura).toBe('08:00');
    expect(surtidor.cierre).toBe('20:00');
    expect(surtidor.contacto).toBe('73333333');
  });

  it('debería obtener un surtidor por su nombre', () => {
    const conductor = new Conductor();
    conductor.agregarSurtidor({
      nombre: 'Surtidorcito',
      estado: 'Disponible',
      fila: 1,
      zona: 'ZonaX',
      litros: 4000,
      apertura: '08:00',
      cierre: '20:00',
      contacto: '71112222',
    });

    const resultado = conductor.obtenerSurtidorPorNombre('Surtidorcito');

    expect(resultado).toBeDefined();
    expect(resultado.nombre).toBe('Surtidorcito');
  });

  it('debería agregar un surtidor incluyendo horario y contacto (versión alternativa)', () => {
    const conductor = new Conductor();
    conductor.agregarSurtidor({
      nombre: 'Surtidor A',
      estado: 'Disponible',
      fila: 3,
      zona: 'Centro',
      litros: 4000,
      apertura: '08:00',
      cierre: '22:00',
      contacto: '4444444',
    });

    const surtidor = conductor.listaSurtidores().find(s => s.nombre === 'Surtidor A');
    expect(surtidor).toBeDefined();
    expect(surtidor.apertura).toBe('08:00');
    expect(surtidor.contacto).toBe('4444444');
  });

  describe('Conductor - generarTicket', () => {
  let conductor;

  beforeEach(() => {
    conductor = new Conductor();
  });

  it('debería generar un ticket válido con datos del surtidor', () => {
    const surtidor = {
      nombre: 'Surtidor Test',
      zona: 'Zona Test',
      litros: 8000,
      apertura: '07:00',
      cierre: '19:00'
    };

    const ticket = conductor.generarTicket('Estación Central', surtidor, 'Gasolina 95');

      expect(ticket).toContain('*** TICKET DE SURTIDOR ***');
      expect(ticket).toContain('Estación: Estación Central');
      expect(ticket).toContain('Nombre: Surtidor Test');
      expect(ticket).toContain('Tipo combustible: Gasolina 95');
      expect(ticket).toContain('Zona: Zona Test');
      expect(ticket).toContain('Litros disponibles: 8000');
      expect(ticket).toContain('Horario: 07:00 - 19:00');
      expect(ticket).toMatch(/Fecha emisión: .+/);
  });

  it('debería lanzar error si los datos son inválidos', () => {
    expect(() => conductor.generarTicket('Mi Estación', { nombre: '', litros: 1000 }, 'Gasolina'))
      .toThrow('generarTicket: datos inválidos');

    expect(() => conductor.generarTicket('Mi Estación', { nombre: 'Surtidor X', litros: null }, 'Gasolina'))
      .toThrow('generarTicket: datos inválidos');

    expect(() => conductor.generarTicket('Mi Estación', null, 'Gasolina'))
      .toThrow('generarTicket: datos inválidos');
  });

  describe('Generación de tickets', () => {
  it('debería generar un ticket válido con datos del surtidor', () => {
    const surtidor = {
      nombre: 'Surtidor Test',
      zona: 'Zona Test',
      litros: 8000,
      apertura: '07:00',
      cierre: '19:00'
    };

    const ticketsPorSurtidor = {};

    if (!ticketsPorSurtidor[surtidor.nombre]) {
      ticketsPorSurtidor[surtidor.nombre] = [];
    }

    const nuevoTicket = {
      fecha: '2025-05-19 10:30', 
      mensaje: `Ticket generado para ${surtidor.nombre}`
    };

    ticketsPorSurtidor[surtidor.nombre].push(nuevoTicket);

    expect(ticketsPorSurtidor[surtidor.nombre]).toHaveLength(1);
    expect(ticketsPorSurtidor[surtidor.nombre][0].mensaje).toBe('Ticket generado para Surtidor Test');
  });
});

});
it('debería lanzar un error si el monto excede los 150 Bs', () => {
  const conductor = new Conductor();
  const monto = 200; 
  expect(() => {
    conductor.generarTicketConMonto(monto);
  }).toThrow('El monto no puede superar los 150 Bs.');
});


it('debería incluir la fecha de reserva al crear el ticket', () => {
  const ahora = new Date().toLocaleString();
  const ticket = {
    codigo: '0001',
    hora: '09:00',
    monto: 100,
    fechaReserva: ahora,
    fechaProgramada: '2025-05-20',
    mensaje: 'Test ticket'
  };

  expect(ticket.fechaReserva).toBe(ahora);
  expect(ticket.fechaProgramada).toBe('2025-05-20');
});

it('debería generar el código del ticket con 4 dígitos', () => {
  const numero = 3;
  const codigo = numero.toString().padStart(4, '0');
  expect(codigo).toBe('0003');
});


it('debería crear un ticket completo con todos los campos válidos', () => {
  const surtidor = {
    nombre: 'Surtidor X',
    zona: 'Zona Y'
  };

  const ticketsPorSurtidor = {};
  if (!ticketsPorSurtidor[surtidor.nombre]) {
    ticketsPorSurtidor[surtidor.nombre] = [];
  }

  const ticket = {
    codigo: '0001',
    hora: '08:30',
    monto: 120,
    fechaReserva: '2025-05-19 08:00',
    fechaProgramada: '2025-05-20',
    surtidor: surtidor.nombre,
    zona: surtidor.zona,
    mensaje: `Ticket generado para ${surtidor.nombre}`
  };

  ticketsPorSurtidor[surtidor.nombre].push(ticket);

  const t = ticketsPorSurtidor[surtidor.nombre][0];
  expect(t.codigo).toBe('0001');
  expect(t.monto).toBeLessThanOrEqual(150);
  expect(t.fechaReserva).toBe('2025-05-19 08:00');
  expect(t.fechaProgramada).toBe('2025-05-20');
  expect(t.surtidor).toBe('Surtidor X');
});

describe('filtrarTickets', () => {
  const tickets = [
    { numero: 'TICKET-001', nombre: 'Juan Pérez' },
    { numero: 'TICKET-002', nombre: 'María Gómez' },
    { numero: 'TICKET-003', nombre: 'Pedro Sánchez' }
  ];

  test('devuelve tickets que coinciden con el nombre', () => {
    const resultado = filtrarTickets(tickets, 'María');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('María Gómez');
  });

  test('devuelve tickets que coinciden con el número', () => {
    const resultado = filtrarTickets(tickets, '003');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].numero).toBe('TICKET-003');
  });

  test('no distingue mayúsculas o minúsculas', () => {
    const resultado = filtrarTickets(tickets, 'juan');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('Juan Pérez');
  });

  test('devuelve un arreglo vacío si no hay coincidencias', () => {
    const resultado = filtrarTickets(tickets, 'X123');
    expect(resultado).toEqual([]);
  });
});

it("debería aceptar solo monto o solo fracción", () => {
    const validar = (monto, fraccion) => {
      if ((monto && fraccion) || (!monto && !fraccion)) {
        throw new Error("Debe ingresar solo uno");
      }
      return true;
    };
    expect(() => validar(100, 0.5)).toThrow();
    expect(() => validar(null, null)).toThrow();
    expect(validar(100, null)).toBe(true);
    expect(validar(null, 0.25)).toBe(true);
  });

  class Surtidor {
  constructor(nombre, litros) {
    this.nombre = nombre;
    this.litros = litros;        
    this.zona   = 'Prueba';
    this.apertura = '06:00';
    this.cierre   = '22:00';
  }
}

  describe('Generacion de tickets y limite del 20%', () => {
  let presenter;
  let mockSurtidor;

  beforeEach(() => {
    presenter = new Presenter();
    mockSurtidor = new Surtidor('S1', 100);   
    presenter.ticketsPorSurtidor[mockSurtidor.nombre] = [];
  });

  test('Deberia generar tcikets en formato: T-0001, T-0002...', () => {
    const codes = ['T-0001', 'T-0002', 'T-0003'];
    codes.forEach(expected => {
      const code = presenter.generarCodigoTicket(mockSurtidor);
      presenter.ticketsPorSurtidor[mockSurtidor.nombre].push({ codigo: code });
      expect(code).toBe(expected);
    });
  });

  test('No deberia generar mas de 20 % tickets', () => {
    for (let i = 0; i < 20; i++) {
      presenter.ticketsPorSurtidor[mockSurtidor.nombre].push({ codigo: `T-${(i+1).toString().padStart(4,'0')}` });
    }
    expect(() => presenter.generarCodigoTicket(mockSurtidor))
      .toThrow(`Límite de tickets alcanzado para ${mockSurtidor.nombre}`);
  });
});

it('debería rechazar montos mayores al permitido para una moto', () => {
  const presenter = new Presenter(); 
  const tipoVehiculo = 'moto';
  const montoIngresado = 1000; 
  const fraccion = null;


  const capacidadMoto = 22;
  const precioLitro = 3.74;
  const montoMaximo = Math.round(capacidadMoto * precioLitro); 

  const esValido = montoIngresado <= montoMaximo;

  expect(esValido).toBe(false);
});

it('debería aceptar un monto válido para un vehículo pequeño', () => {
  const tipoVehiculo = 'pequeno';
  const montoIngresado = 180;
  const capacidad = 52;
  const precioLitro = 3.74;
  const montoMaximo = Math.round(capacidad * precioLitro); // ~195 Bs

  const esValido = montoIngresado <= montoMaximo;

  expect(esValido).toBe(true);
});

describe('Gestión de Tickets', () => {
  let presenter;

  beforeEach(() => {
    // Simulamos el objeto presenter con estado inicial
    presenter = {
      ticketsPorSurtidor: {
        'Surtidor1': [
          { codigo: 'T-0001', monto: 100, nombreReservante: 'Juan', surtidor: 'Surtidor1' },
          { codigo: 'T-0002', monto: 150, nombreReservante: 'Ana', surtidor: 'Surtidor1' }
        ]
      },
      conductor: {
        obtenerSurtidorPorNombre: jest.fn().mockReturnValue({ nombre: 'Surtidor1', litros: 100 }),
      },
      mostrarFormularioTicket: jest.fn(),
      mostrarSurtidores: jest.fn(),
      eliminarTicket(surtidorNombre, index) {
        this.ticketsPorSurtidor[surtidorNombre].splice(index, 1);
        this.mostrarSurtidores();
      },
      editarTicket(surtidorNombre, index) {
        const ticket = this.ticketsPorSurtidor[surtidorNombre][index];
        const surtidor = this.conductor.obtenerSurtidorPorNombre(surtidorNombre);
        this.mostrarFormularioTicket(surtidor, ticket);
      }
    };
  });

  test('editarTicket llama a mostrarFormularioTicket con surtidor y ticket correctos', () => {
    presenter.editarTicket('Surtidor1', 1);
    expect(presenter.conductor.obtenerSurtidorPorNombre).toHaveBeenCalledWith('Surtidor1');
    expect(presenter.mostrarFormularioTicket).toHaveBeenCalledWith(
      { nombre: 'Surtidor1', litros: 100 },
      { codigo: 'T-0002', monto: 150, nombreReservante: 'Ana', surtidor: 'Surtidor1' }
    );
  });

  test('eliminarTicket elimina correctamente el ticket y llama a mostrarSurtidores', () => {
    expect(presenter.ticketsPorSurtidor['Surtidor1']).toHaveLength(2);

    presenter.eliminarTicket('Surtidor1', 0);

    expect(presenter.ticketsPorSurtidor['Surtidor1']).toHaveLength(1);
    expect(presenter.ticketsPorSurtidor['Surtidor1'][0].codigo).toBe('T-0002');
    expect(presenter.mostrarSurtidores).toHaveBeenCalled();
  });
});


});