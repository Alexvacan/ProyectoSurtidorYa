const { calcularProbabilidadCarga } = require('././probabilidadCargaService');

describe('Servicio de Probabilidad de Carga', () => {
  it('debería retornar 0 si no hay combustible o autos', () => {
    const resultado = calcularProbabilidadCarga({
      combustibleDisponible: 0,
      autosEsperando: 0,
      tipoAuto: 'grande'
    });
    expect(resultado.autosQuePodranCargar).toBe(0);
    expect(resultado.porcentaje).toBe(0);
  });

  it('debería calcular correctamente con más autos que gasolina', () => {
    // combustible utilizable = 100 * 0.8 = 80 litros
    // consumo "grande" = 50 litros por auto
    // autos que podrán cargar (sin límite) = floor(80/50) = 1
    // autosEsperando = 3
    // autosQuePodranCargar = min(1,3) = 1
    // porcentaje = round(1/(3+1)*100) = 25
    const datos = {
      combustibleDisponible: 100,
      autosEsperando: 3,
      tipoAuto: 'grande'
    };
    const resultado = calcularProbabilidadCarga(datos);
    expect(resultado.autosQuePodranCargar).toBe(1);
    expect(resultado.porcentaje).toBe(25);
  });

  it('debería calcular para autos pequeños', () => {
    // combustible utilizable = 100 * 0.8 = 80 litros
    // consumo "pequeno" = 25 litros por auto
    // autos que podrán cargar = floor(80/25) = 3
    // autosEsperando = 3
    // autosQuePodranCargar = min(3,3) = 3
    // porcentaje = round(3/(3+1)*100) = 75
    const datos = {
      combustibleDisponible: 100,
      autosEsperando: 3,
      tipoAuto: 'pequeno'
    };
    const resultado = calcularProbabilidadCarga(datos);
    expect(resultado.autosQuePodranCargar).toBe(3);
    expect(resultado.porcentaje).toBe(75);
  });

  it('debería calcular porcentaje 100 si hay suficientes autos y combustible', () => {
    // combustible utilizable = 200 * 0.8 = 160 litros
    // consumo "moto" = 10 litros por auto
    // autos que podrán cargar = floor(160/10) = 16
    // autosEsperando = 10
    // autosQuePodranCargar = min(16,10) = 10
    // autosEsperando + 1 = 11 <= 16 → porcentaje = 100
    const datos = {
      combustibleDisponible: 200,
      autosEsperando: 10,
      tipoAuto: 'moto'
    };
    const resultado = calcularProbabilidadCarga(datos);
    expect(resultado.autosQuePodranCargar).toBe(10);
    expect(resultado.porcentaje).toBe(100);
  });

  it('debería usar consumoPromedioPorAuto si se pasa explícitamente', () => {
    // combustible utilizable = 100 * 0.8 = 80 litros
    // consumoPromedioPorAuto = 20 litros por auto
    // autos que podrán cargar = floor(80/20) = 4
    // autosEsperando = 3
    // autosQuePodranCargar = min(4,3) = 3
    // porcentaje = round(4/(3+1)*100) = round(4/4*100) = 100
    const datos = {
      combustibleDisponible: 100,
      autosEsperando: 3,
      consumoPromedioPorAuto: 20
    };
    const resultado = calcularProbabilidadCarga(datos);
    expect(resultado.autosQuePodranCargar).toBe(3);
    expect(resultado.porcentaje).toBe(100);
  });

  it('debería retornar 0 si autosEsperando es null o undefined', () => {
    const resultado1 = calcularProbabilidadCarga({
      combustibleDisponible: 100,
      autosEsperando: null,
      tipoAuto: 'moto'
    });
    const resultado2 = calcularProbabilidadCarga({
      combustibleDisponible: 100,
      autosEsperando: undefined,
      tipoAuto: 'moto'
    });
    expect(resultado1.autosQuePodranCargar).toBe(0);
    expect(resultado1.porcentaje).toBe(0);
    expect(resultado2.autosQuePodranCargar).toBe(0);
    expect(resultado2.porcentaje).toBe(0);
  });
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

   
