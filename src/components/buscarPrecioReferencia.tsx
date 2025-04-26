import { supabase } from "@/lib/supabaseClient";

export async function buscarPrecioReferencia(params: {
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo?: string;
  combustible?: string;
}): Promise<number | null> {
  const { marca, modelo, anio } = params;

  // 🟨 Buscar todas las coincidencias de ese modelo, marca y año sin filtrar por tipo o combustible
  const { data, error } = await supabase
    .from("vehiculos_ref")
    .select("precio1, precio2, precio3, tipo_vehiculo, combustible")
    .eq("marca", marca)
    .eq("modelo", modelo)
    .eq("anio", anio);

  if (error || !data || data.length === 0) {
    console.warn("⚠️ Precio de referencia no encontrado:", error?.message || "No data");
    return null;
  }

  // ✅ Opcional: Mostrar qué coincidencias se encontraron
  console.log("Coincidencias encontradas:", data.map(d => ({
    tipo: d.tipo_vehiculo,
    combustible: d.combustible
  })));

  // ✅ Tomar la primera coincidencia para calcular el promedio
  const ref = data[0];

  const precios = [
    typeof ref.precio1 === "string" ? parseFloat(ref.precio1) : ref.precio1,
    typeof ref.precio2 === "string" ? parseFloat(ref.precio2) : ref.precio2,
    typeof ref.precio3 === "string" ? parseFloat(ref.precio3) : ref.precio3,
  ].filter(p => typeof p === "number" && !isNaN(p));

  if (precios.length === 0) return null;

  const promedio = precios.reduce((a, b) => a + b, 0) / precios.length;
  return Math.round(promedio);
}
