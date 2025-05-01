import { supabase } from "@/lib/supabaseClient";

export async function buscarPrecioReferencia(params: {
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo?: string;
  combustible?: string;
}): Promise<number | null> {
  const marca = params.marca.trim();
  const modelo = params.modelo.trim();
  const anio = params.anio;
  const tipo_vehiculo = params.tipo_vehiculo?.trim();
  const combustible = params.combustible?.trim();

  // 🔍 Primera búsqueda tolerante con todos los filtros
  let query = supabase
    .from("vehiculos_ref")
    .select("precio1, precio2, precio3")
    .ilike("marca", marca)
    .ilike("modelo", modelo)
    .eq("anio", anio);

  if (tipo_vehiculo) query = query.ilike("tipo_vehiculo", tipo_vehiculo);
  if (combustible) query = query.ilike("combustible", combustible);

  let { data, error } = await query;

  // 🔁 Fallback si no hay resultados: sin tipo ni combustible
  if (!data || data.length === 0) {
    console.warn("🎯 Reintentando búsqueda solo con marca, modelo y año");
    const fallback = await supabase
      .from("vehiculos_ref")
      .select("precio1, precio2, precio3")
      .ilike("marca", marca)
      .ilike("modelo", modelo)
      .eq("anio", anio);

    data = fallback.data;
    error = fallback.error;
  }

  // ❌ Si sigue sin encontrar, loguea el fallo y retorna null
  if (error || !data || data.length === 0) {
    console.warn("Precio de referencia no encontrado:", error?.message || "No data");

    // 📥 Registro opcional de búsquedas fallidas
    await supabase.from("referencias_faltantes").insert([
      { marca, modelo, anio }
    ]);

    return null;
  }

  // ✅ Promediar precios válidos
  const ref = data[0];
  const precios = [ref.precio1, ref.precio2, ref.precio3]
    .map(p => typeof p === "string" ? parseFloat(p) : p)
    .filter(p => typeof p === "number" && !isNaN(p));

  if (precios.length === 0) return null;

  const promedio = precios.reduce((a, b) => a + b, 0) / precios.length;
  return Math.round(promedio);
}
