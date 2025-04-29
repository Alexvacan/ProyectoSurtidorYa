export function calcularProbabilidadCarga({ combustibleDisponible, autosEsperando, consumoPromedioPorAuto }) {
    const autosQuePodranCargar = Math.floor(combustibleDisponible / consumoPromedioPorAuto);
    const porcentaje = autosEsperando === 0 ? 100 : Math.min(100, Math.round((autosQuePodranCargar / autosEsperando) * 100));
    return {
      porcentaje,
      autosQuePodranCargar
    };
}