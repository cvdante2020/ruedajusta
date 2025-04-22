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
  garantia?: boolean;
}

export async function calcularValoracion(formData: FormDataTipo) {
  const anioActual = new Date().getFullYear();
  const anioVehiculo = parseInt(formData.anio);
  const kilometraje = parseInt(formData.kilometraje) || 0;
  const duenios = parseInt(formData.duenios) || 1;

  const marca = formData.marca?.toLowerCase().trim();
  const modelo = formData.modelo?.toLowerCase().trim();

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

  // 1. Depreciación más justa (1% por año)
  const edad = anioActual - anioVehiculo;
  const depreciacionPorAnio = 0.01;
  valor -= precioBase * depreciacionPorAnio * edad;

  // 2. Kilometraje
  if (kilometraje > 200000) valor -= precioBase * 0.03;
  else if (kilometraje > 150000) valor -= precioBase * 0.02;
  else if (kilometraje > 100000) valor -= precioBase * 0.01;

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

  // 5. Tecnología y confort (checklist)
  const extras = [
    "techoCorredizo", "camara_retro", "camara_frontal", "aire_asientos",
    "aireAcondicionado", "vidriosConduct", "vidriosTodos",
    "sensorImpacto", "sensorProximidad", "retrovisoresElectricos",
    "sensores_retro", "sensores_estacionamiento", "aparcamiento_autonomo"
  ];
  const extrasActivos = extras.filter((e) => formData[e]).length;
  valor += extrasActivos * 50;

  // 6. Garantía
  if (formData.garantia) valor += 300;

  // 7. Resultado final
  const valorFinal = Math.max(2000, Math.round(valor));
  const porcentaje = valorFinal / precioBase;
  const puntaje = Math.round(porcentaje * 100);

  return {
    precioBase: Math.round(precioBase),
    valorFinal,
    puntaje,
    porcentaje: Math.round(porcentaje * 100) / 100,
  };
}
