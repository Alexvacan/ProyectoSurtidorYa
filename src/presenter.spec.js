import { Presenter } from './presenter.js';

// Simular un entorno DOM mínimo y localStorage
beforeEach(() => {
  global.localStorage = { getItem: jest.fn(() => null), setItem: jest.fn() };
  global.document = {
    getElementById: jest.fn().mockImplementation((id) => ({
      innerHTML: '',
      value: '',
      addEventListener: jest.fn(),
      appendChild: jest.fn(),
      classList: { add: jest.fn() },
      style: {}
    }))
  };
});

describe('Presenter – franjas horarias', () => {
  it('debe exponer el método mostrarFranjas', () => {
    const p = new Presenter();
    expect(typeof p.mostrarFranjas).toBe('function');
  });

  it('debe exponer el método manejarSeleccionSurtidor', () => {
    const p = new Presenter();
    expect(typeof p.manejarSeleccionSurtidor).toBe('function');
  });
});