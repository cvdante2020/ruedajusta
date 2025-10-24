"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AmazonMiniAds from "./AmazonMiniAds";

type Side = "left" | "right";
type ProductoAmazon = { nombre: string; url: string; img: string };

function getSiteId() {
  return process.env.NEXT_PUBLIC_SITE_ID || "default";
}

export default function MiniAdsFromDB({ posicion }: { posicion: Side }) {
  const [productos, setProductos] = useState<ProductoAmazon[] | null>(null);

  useEffect(() => {
    let alive = true;
    const siteId = getSiteId();

    (async () => {
      const { data, error } = await supabase
        .from("miniads")
        .select("name, url, img_url, side, slot, is_active, site_id, expires_at")
        .eq("is_active", true)
        .eq("side", posicion)
        .eq("site_id", siteId)         // 👈 filtra por sitio
        .order("slot", { ascending: true })
        .limit(2);

      if (!alive) return;

      if (error) {
        console.error("miniads error:", error);
        setProductos([]);
        return;
      }

      const mapped =
        (data ?? []).map((r: any) => ({
          nombre: r.name,
          url: r.url,
          img: r.img_url,
        })) || [];

      setProductos(mapped);
    })();

    return () => {
      alive = false;
    };
  }, [posicion]);

  if (!productos || productos.length === 0) return null;

  return <AmazonMiniAds productos={productos} posicion={posicion} />;
}
