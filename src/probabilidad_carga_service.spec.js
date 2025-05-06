import { calcularProbabilidadCarga } from './probabilidadCargaService';

describe('Servicio de Probabilidad de Carga', () => {

    it('debería retornar un objeto con las claves porcentaje y autosQuePodranCargar', () => {
      const datos = {
        combustibleDisponible: 100,
        autosEsperando: 10,
        consumoPromedioPorAuto: 10
      };
  
      const resultado = calcularProbabilidadCarga(datos);
  
      expect(resultado).toHaveProperty('porcentaje');
      expect(resultado).toHaveProperty('autosQuePodranCargar');
    });

    it('debería retornar porcentaje menor si hay más autos que gasolina', () => {
        const datos = {
          combustibleDisponible: 30,
          autosEsperando: 4,
          consumoPromedioPorAuto: 10
        };
    
        const resultado = calcularProbabilidadCarga(datos);
        expect(resultado.autosQuePodranCargar).toBe(1);
        expect(resultado.porcentaje).toBe(38);
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
});
