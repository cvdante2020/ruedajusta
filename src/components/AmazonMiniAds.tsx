"use client";

import Image from "next/image";

interface ProductoAmazon {
  nombre: string;
  url: string; // enlace original (por ejemplo, de Amazon)
  img: string; // URL pública (Supabase Storage o /public)
}

export default function AmazonMiniAds({
  productos,
  posicion,
}: {
  productos: ProductoAmazon[];
  posicion: "left" | "right";
}) {
  const side = posicion === "right" ? "right-6" : "left-6";

  // Detecta el path actual para registrarlo en la base
  const path =
    typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <div
      className={`fixed bottom-[25rem] ${side} z-40 flex flex-col gap-3 items-center`}
    >
      {productos.map((p, i) => {
        // 👇 Aquí construimos el link con redirección /r
        const trackUrl =
          `/r?to=${encodeURIComponent(p.url)}` +
          `&side=${posicion}` +
          `&slot=${i + 1}` +
          `&name=${encodeURIComponent(p.nombre)}` +
          `&path=${encodeURIComponent(path)}`;

        return (
          <a
            key={`${p.url}-${i}`}
            href={trackUrl} // 👈 AQUÍ está el cambio importante
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-md overflow-hidden w-32 hover:shadow-lg transition border border-gray-200"
            title={p.nombre}
          >
            <div className="relative w-full h-28">
              <Image
                src={p.img}
                alt={p.nombre}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-1 text-center">
              <p className="text-[11px] font-semibold text-gray-800 leading-tight">
                {p.nombre}
              </p>
             
            </div>
          </a>
        );
      })}
    </div>
  );
}
