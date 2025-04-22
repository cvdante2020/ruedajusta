"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EvaluacionesAdmin() {
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verificarSesion = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        router.push("/admin/login");
      } else {
        fetchData();
      }
    };

    const fetchData = async () => {
      const { data } = await supabase
        .from("evaluaciones")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      setEvaluaciones(data || []);
      setCargando(false);
    };

    verificarSesion();
  }, [router]);

  if (cargando) {
    return (
      <div className="p-10 text-center text-lg text-gray-700">
        Cargando información...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Evaluaciones Realizadas</h1>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Ciudad</th>
            <th className="px-4 py-2">Marca</th>
            <th className="px-4 py-2">Modelo</th>
            <th className="px-4 py-2">Año</th>
            <th className="px-4 py-2">Valor ($)</th>
            <th className="px-4 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {evaluaciones.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="px-4 py-2">{e.nombre} {e.apellido}</td>
              <td className="px-4 py-2">{e.email}</td>
              <td className="px-4 py-2">{e.ciudad}</td>
              <td className="px-4 py-2">{e.Marca}</td>
              <td className="px-4 py-2">{e.modelo}</td>
              <td className="px-4 py-2">{e.anio}</td>
              <td className="px-4 py-2">${e.valorFinal?.toLocaleString()}</td>
              <td className="px-4 py-2">{new Date(e.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
