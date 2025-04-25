import { supabase } from "@/lib/supabaseClient";

export async function buscarPrecioReferencia(params: {
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: string;
  combustible: string;
}): Promise<number | null> {
  const { marca, modelo, anio, tipo_vehiculo, combustible } = params;

  const { data, error } = await supabase
    .from("vehiculos_ref")
    .select("precio1, precio2, precio3")
    .eq("marca", marca)
    .eq("modelo", modelo)
    .eq("anio", anio)
    .eq("tipo_vehiculo", tipo_vehiculo)
    .eq("combustible", combustible)
    .limit(1)
    .single(); // OK si solo quieres el primero encontrado

  if (error || !data) {
    console.warn("⚠️ Precio de referencia no encontrado:", error?.message || "No data");
    return null;
  }

  const precios = [
    typeof data.precio1 === 'string' ? parseFloat(data.precio1) : data.precio1,
    typeof data.precio2 === 'string' ? parseFloat(data.precio2) : data.precio2,
    typeof data.precio3 === 'string' ? parseFloat(data.precio3) : data.precio3
  ].filter((p) => typeof p === 'number' && !isNaN(p));

  if (precios.length === 0) {
    console.warn("⚠️ Precios inválidos encontrados para este vehículo.");
    return null;
  }

  const precioPromedio = precios.reduce((a, b) => a + b, 0) / precios.length;

  console.log("💾 Precio base promedio encontrado en Supabase:", precioPromedio);

  return Math.round(precioPromedio);
}
