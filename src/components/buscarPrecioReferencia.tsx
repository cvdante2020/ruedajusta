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
    .select("precio_referencia")
    .eq("marca", marca)
    .eq("modelo", modelo)
    .eq("anio", anio)
    .eq("tipo_vehiculo", tipo_vehiculo)
    .eq("combustible", combustible)
    .limit(1) // <--- esto previene error por múltiples
    .single();

  if (error || !data) {
    console.warn("⚠️ Precio de referencia no encontrado:", error?.message || "No data");
    return null;
  }
  console.log("💾 Precio base encontrado en Supabase:", data.precio_referencia);

  return data.precio_referencia;
}
