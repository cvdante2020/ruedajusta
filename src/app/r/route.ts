import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("to");         // URL de Amazon
  const side   = (url.searchParams.get("side") ?? "right") as "left" | "right";
  const slot   = Number(url.searchParams.get("slot") ?? 1);
  const name   = url.searchParams.get("name") ?? null;
  const page   = url.searchParams.get("path") ?? null; // path de la página origen
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "default";

  // Validación básica
  if (!target) {
    return NextResponse.json({ error: "missing 'to' param" }, { status: 400 });
  }

  // Evita esquemas no http(s)
  let finalUrl: URL;
  try {
    finalUrl = new URL(target);
    if (!/^https?:$/.test(finalUrl.protocol)) throw new Error("invalid protocol");
  } catch {
    return NextResponse.json({ error: "invalid 'to' url" }, { status: 400 });
  }

  const referrer = url.searchParams.get("ref") || ""; // opcional si lo quieres pasar desde el cliente
  const userAgent = ""; // Si necesitas user-agent real, usa middleware/headers en Next 15 con Edge. Para simple logging lo dejamos vacío.

  // Guardar el clic (no bloquea el redirect si falla)
  try {
    await supabase.from("miniads_clicks").insert({
      site_id: siteId,
      side,
      slot,
      ad_name: name,
      target_url: finalUrl.toString(),
      page_path: page,
      referrer: referrer,
      user_agent: userAgent,
    });
  } catch (e) {
    console.error("click log error:", e);
  }

  // Redirect 302 al destino
  return NextResponse.redirect(finalUrl.toString(), { status: 302 });
}
