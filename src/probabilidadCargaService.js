export function calcularProbabilidadCarga({
  combustibleDisponible,
  autosEsperando,
  consumoPromedioPorAuto = 20
}) {
  const litrosDisponibles = Number(combustibleDisponible);
  const numeroDeAutos = Number(autosEsperando);

  // Ajustamos el consumo promedio por un factor mayor para reducir la probabilidad
  const litrosPorAuto = Number(consumoPromedioPorAuto) * 2; // doblamos el consumo

  if (numeroDeAutos === 0 || litrosPorAuto <= 0 || litrosDisponibles === 0) {
    return { porcentaje: 0, autosQuePodranCargar: 0 };
  }

  const demandaTotal = numeroDeAutos * litrosPorAuto;
  const autosQuePodranCargar = Math.floor(litrosDisponibles / litrosPorAuto);

  let porcentaje = (litrosDisponibles / demandaTotal) * 100;
  porcentaje = Math.min(100, Math.round(porcentaje));

  return {
    porcentaje,
    autosQuePodranCargar
  };
}




