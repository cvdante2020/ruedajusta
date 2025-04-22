"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthProtection } from "@/hooks/useAuthProtection";

export default function SolicitudesAdmin() {
  const { autenticado, verificando } = useAuthProtection();
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("solicitudes_ofertas")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });
      setSolicitudes(data || []);
    };
    if (autenticado) fetchData();
  }, [autenticado]);

  if (verificando) return <div className="p-10 text-center">Verificando acceso...</div>;
  if (!autenticado) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Vehículo</h1>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">WhatsApp</th>
            <th className="px-4 py-2">Ciudad</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Marca</th>
            <th className="px-4 py-2">Año</th>
            <th className="px-4 py-2">Precio</th>
            <th className="px-4 py-2">Combustible</th>
            <th className="px-4 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="px-4 py-2">{s.nombre}</td>
              <td className="px-4 py-2">{s.email}</td>
              <td className="px-4 py-2">{s.whatsapp}</td>
              <td className="px-4 py-2">{s.ciudad}</td>
              <td className="px-4 py-2">{s.tipo}</td>
              <td className="px-4 py-2">{s.marca}</td>
              <td className="px-4 py-2">{s.anioMin} - {s.anioMax}</td>
              <td className="px-4 py-2">${s.precioMin} - ${s.precioMax}</td>
              <td className="px-4 py-2">{s.combustible}</td>
              <td className="px-4 py-2">{new Date(s.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
