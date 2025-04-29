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
});
