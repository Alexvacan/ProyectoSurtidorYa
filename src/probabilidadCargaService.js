export function calcularProbabilidadCarga({ combustibleDisponible, autosEsperando, consumoPromedioPorAuto, tipoAuto }) {
  let consumoPorAuto;

  if (consumoPromedioPorAuto) {
    consumoPorAuto = consumoPromedioPorAuto;
  } else if (tipoAuto) {
    switch (tipoAuto) {
      case 'pequeno':
        consumoPorAuto = 20;
        break;
      case 'grande':
        consumoPorAuto = 50;
        break;
      case 'moto':
        consumoPorAuto = 7;
        break;
      default:
        consumoPorAuto = 30;
    }
  } else {
    // Manejo por defecto si falta el dato necesario
    return {
      autosQuePodranCargar: 0,
      porcentaje: 0
    };
  }

  const autosQuePodranCargar = Math.min(
    Math.floor(combustibleDisponible / consumoPorAuto),
    autosEsperando
  );

  const porcentaje = autosEsperando > 0
    ? Math.round((autosQuePodranCargar / autosEsperando) * 100)
    : 0;

  return {
    autosQuePodranCargar,
    porcentaje
  };
}

module.exports = { calcularProbabilidadCarga };
