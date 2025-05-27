export function calcularProbabilidadCarga({ 
  combustibleDisponible,
  autosEsperando,
  consumoPromedioPorAuto,
  tipoAuto
}) {
  if (autosEsperando == null) {
    return { autosQuePodranCargar: 0, porcentaje: 0 };
  }

  autosEsperando = Number(autosEsperando);

  const combustibleUtilizable = combustibleDisponible * 0.8;

  const consumoPromedioPorTipo = {
    moto: 10,
    pequeno: 25,
    grande: 50,
    default: 30
  };

  const consumo = consumoPromedioPorAuto ||
    consumoPromedioPorTipo[tipoAuto] ||
    consumoPromedioPorTipo.grande;

  if (!combustibleUtilizable || !consumo) {
    return { autosQuePodranCargar: 0, porcentaje: 0 };
  }

  const autosQuePodranCargar = Math.floor(combustibleUtilizable / consumo);

  let porcentaje = 0;
  if (autosEsperando + 1 <= autosQuePodranCargar) {
    porcentaje = 100;
  } else {
    porcentaje = Math.round((autosQuePodranCargar / (autosEsperando + 1)) * 100);
  }

  return {
    autosQuePodranCargar: Math.min(autosQuePodranCargar, autosEsperando),
    porcentaje
  };
}
