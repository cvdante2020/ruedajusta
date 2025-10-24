"use client";

interface ProductoAmazon {
nombre: string;
url: string; // link final (Amazon)
img: string; // URL pública (Supabase)
}

export default function AmazonMiniAds({
productos,
posicion,
}: {
productos: ProductoAmazon[];
posicion: "left" | "right";
}) {
const side = posicion === "right" ? "right-6" : "left-6";
const path = typeof window !== "undefined" ? window.location.pathname : "/";

return (
<div className={`fixed bottom-[25rem] ${side} z-40 flex flex-col gap-3 items-center`}>
{productos.map((p, i) => {
const imgUrl = (p.img || "").trim();
const trackUrl =
`/r?to=${encodeURIComponent(p.url)}` +
`&side=${posicion}` +
`&slot=${i + 1}` +
`&name=${encodeURIComponent(p.nombre)}` +
`&path=${encodeURIComponent(path)}`;

// trazas
console.log(`[MiniAd ${posicion} #${i + 1}]`, { nombre: p.nombre, imgUrl });

return (
<a
key={`${p.url}-${i}`}
href={trackUrl}
target="_blank"
rel="noopener noreferrer"
className="bg-white rounded-xl shadow-md overflow-hidden w-32 hover:shadow-lg transition border border-gray-200"
title={p.nombre}
>
<div className="relative w-full h-28">
<img
src={imgUrl}
alt={p.nombre}
className="w-full h-full object-cover"
loading="lazy"
referrerPolicy="no-referrer"
onLoad={() => console.log("✅ cargó imagen:", imgUrl)}
onError={(e) => {
console.error("❌ no cargó imagen:", imgUrl);
(e.currentTarget as HTMLImageElement).src =
"data:image/svg+xml;utf8," +
encodeURIComponent(
`<svg xmlns='http://www.w3.org/2000/svg'; width='128' height='112'>
<rect width='100%' height='100%' fill='#f3f4f6'/>
<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='sans-serif' font-size='12'>Imagen no disponible</text>
</svg>`
);
}}
/>
</div>
<div className="p-1 text-center">
<p className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2">
{p.nombre}
</p>
<span className="text-[10px] text-blue-600 font-bold">Ver →</span>
</div>
</a>
);
})}
</div>
);
}

