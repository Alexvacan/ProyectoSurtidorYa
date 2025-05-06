const { calcularProbabilidadCarga } = require('././probabilidadCargaService');

describe('Servicio de Probabilidad de Carga', () => {
  it('debería retornar porcentaje menor si hay más autos que gasolina', () => {
    const datos = {
      combustibleDisponible: 30,
      autosEsperando: 4,
      consumoPromedioPorAuto: 10
    };

    const resultado = calcularProbabilidadCarga(datos);
    expect(resultado.autosQuePodranCargar).toBe(3);
    expect(resultado.porcentaje).toBe(75);
  });

  it('debería manejar correctamente si no hay combustible', () => {
    const datos = {
      combustibleDisponible: 0,
      autosEsperando: 10,
      consumoPromedioPorAuto: 50
    };

    const resultado = calcularProbabilidadCarga(datos);

    expect(resultado.porcentaje).toBe(0);
    expect(resultado.autosQuePodranCargar).toBe(0);
  });

  describe('calcularProbabilidadCarga', () => {
    it('debería calcular la probabilidad para autos pequeños', () => {
      const resultado = calcularProbabilidadCarga({
        combustibleDisponible: 60,
        autosEsperando: 3,
        tipoAuto: 'pequeno'
      });
      expect(resultado.porcentaje).toBeGreaterThan(0);
      expect(resultado.autosQuePodranCargar).toBe(3); // 60 / 20 = 3
    });

    it('debería calcular la probabilidad para autos grandes', () => {
      const resultado = calcularProbabilidadCarga({
        combustibleDisponible: 150,
        autosEsperando: 3,
        tipoAuto: 'grande'
      });
      expect(resultado.porcentaje).toBe(100);
      expect(resultado.autosQuePodranCargar).toBe(3); // 150 / 50 = 3
    });

    it('debería calcular la probabilidad para motos', () => {
      const resultado = calcularProbabilidadCarga({
        combustibleDisponible: 35,
        autosEsperando: 5,
        tipoAuto: 'moto'
      });
      expect(resultado.porcentaje).toBe(100); // 35 / 7 = 5
      expect(resultado.autosQuePodranCargar).toBe(5);
    });
  });
});
