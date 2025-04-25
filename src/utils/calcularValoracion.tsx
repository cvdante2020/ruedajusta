'use client';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FormDataTipo {
  [key: string]: any;
  marca: string;
  modelo: string;
  anio: string;
  kilometraje: string;
  duenios: string;
  tipo_vehiculo?: string; // Nuevo: Tipo de vehículo para definir mínimos
  garantia?: boolean;
}

export async function calcularValoracion(formData: FormDataTipo) {
  const anioActual = new Date().getFullYear();
  const anioVehiculo = parseInt(formData.anio);
  const kilometraje = parseInt(formData.kilometraje) || 0;
  const duenios = parseInt(formData.duenios) || 1;

  const marca = formData.marca?.toLowerCase().trim();
  const modelo = formData.modelo?.toLowerCase().trim();
  const tipoVehiculo = (formData.tipo_vehiculo || 'auto').toLowerCase(); // Por defecto "auto"

  const { data, error } = await supabase
    .from('vehiculos_ref')
    .select('precio1, precio2, precio3')
    .ilike('marca', marca)
    .ilike('modelo', modelo)
    .eq('anio', anioVehiculo.toString());

  if (!data || data.length === 0) {
    return {
      error: 'Vehículo no encontrado en base de datos.',
      valorFinal: 0,
      puntaje: 0,
      porcentaje: 0,
      precioBase: 0,
    };
  }

  const preciosRaw = [data[0].precio1, data[0].precio2, data[0].precio3];
  const precios = preciosRaw
    .map((p) => typeof p === 'string' ? parseFloat(p) : p)
    .filter((p) => typeof p === 'number' && !isNaN(p));

  if (precios.length === 0) {
    return {
      error: 'Precios inválidos en base de datos.',
      valorFinal: 0,
      puntaje: 0,
      porcentaje: 0,
      precioBase: 0,
    };
  }

  const precioBase = precios.reduce((a, b) => a + b, 0) / precios.length;
  let valor = precioBase;

  // 1. Depreciación más justa (0.8% por año)
  const edad = anioActual - anioVehiculo;
  const depreciacionPorAnio = 0.008; // menos agresiva
  valor -= precioBase * depreciacionPorAnio * edad;

  // 2. Kilometraje (depreciación y bonificación)
  if (kilometraje > 200000) valor -= precioBase * 0.03;
  else if (kilometraje > 150000) valor -= precioBase * 0.02;
  else if (kilometraje > 100000) valor -= precioBase * 0.01;
  else if (kilometraje > 0 && kilometraje < 60000) valor += precioBase * 0.015; // Bonificación por poco uso

  // 3. Dueños
  if (duenios === 2) valor -= precioBase * 0.005;
  else if (duenios > 2) valor -= precioBase * 0.01;

  // 4. Evaluación visual
  const camposVisuales = [
    "pintura", "faros", "luces_guias", "direccionales_frontales", "direccionales_posteriores",
    "parabrisas_delantero", "parabrisas_posterior", "ventanas", "carroceria", "persiana",
    "llantas", "llanta_emergencia", "tapiceria", "piso", "techo", "esfera_controles",
    "chapas", "cinturones"
  ];
  const puntajes = camposVisuales.map((c) => parseInt(formData[c] || "3"));
  const promedioVisual = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;

  if (promedioVisual >= 4.5) valor += 300;
  else if (promedioVisual <= 2.5) valor -= 400;
  else {
    const ajusteVisual = (promedioVisual - 3) * 100; // cada punto sobre/bajo 3 ajusta ±100
    valor += ajusteVisual;
  }

  // 5. Tecnología y confort (ponderado)
  const extras = [
    { campo: "techoCorredizo", bonus: 50 },
    { campo: "camara_retro", bonus: 80 },
    { campo: "camara_frontal", bonus: 80 },
    { campo: "aire_asientos", bonus: 60 },
    { campo: "aireAcondicionado", bonus: 40 },
    { campo: "vidriosConduct", bonus: 30 },
    { campo: "vidriosTodos", bonus: 40 },
    { campo: "sensorImpacto", bonus: 80 },
    { campo: "sensorProximidad", bonus: 70 },
    { campo: "retrovisoresElectricos", bonus: 40 },
    { campo: "sensores_retro", bonus: 50 },
    { campo: "sensores_estacionamiento", bonus: 60 },
    { campo: "aparcamiento_autonomo", bonus: 100 },
  ];
  extras.forEach(({ campo, bonus }) => {
    if (formData[campo]) valor += bonus;
  });

  // 6. Garantía
  if (formData.garantia) valor += 300;

  // 7. Mínimos según tipo de vehículo
  let minimoPorTipo = 2000;
  if (tipoVehiculo === "moto") minimoPorTipo = 800;
  else if (tipoVehiculo === "suv" || tipoVehiculo === "camioneta") minimoPorTipo = 3000;

  // 8. Resultado final
  const valorFinal = Math.max(minimoPorTipo, Math.round(valor));
  const porcentaje = valorFinal / precioBase;
  const puntaje = Math.round(porcentaje * 100);

  return {
    precioBase: Math.round(precioBase),
    valorFinal,
    puntaje,
    porcentaje: Math.round(porcentaje * 100) / 100,
  };
}
