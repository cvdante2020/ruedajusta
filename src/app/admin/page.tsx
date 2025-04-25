"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const [evaluacionesCount, setEvaluacionesCount] = useState(0);
  const [solicitudesCount, setSolicitudesCount] = useState(0);
  const [vehiculosRefCount, setVehiculosRefCount] = useState(0);
  const [chatbotCount, setChatbotCount] = useState(0); // ✅ Nuevo: contador de interesados en chatbot
  const [graficoEvaluaciones, setGraficoEvaluaciones] = useState<{ fecha: string; cantidad: number }[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verificarSesionYFetch = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        router.push("/admin/login");
        return;
      }

      await fetchStats();
      setCargando(false);
    };

    verificarSesionYFetch();
  }, [router]);

  const fetchStats = async () => {
    const { count: evaluaciones } = await supabase.from("evaluaciones").select("id", { count: "exact", head: true });
    const { count: solicitudes } = await supabase.from("solicitudes_ofertas").select("id", { count: "exact", head: true });
    const { count: vehiculos } = await supabase.from("vehiculos_ref").select("id", { count: "exact", head: true });
    const { count: chatbots } = await supabase.from("chatbot_interesados").select("id", { count: "exact", head: true }); // ✅ Nuevo

    const { data: evaluacionesData } = await supabase
      .from("evaluaciones")
      .select("created_at")
      .order("created_at", { ascending: false });

    const agrupado = (evaluacionesData || []).reduce((acc, curr) => {
      const fecha = new Date(curr.created_at).toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "short"
      });
      acc[fecha] = (acc[fecha] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dataGrafico = Object.entries(agrupado).map(([fecha, cantidad]) => ({ fecha, cantidad }));

    setEvaluacionesCount(evaluaciones || 0);
    setSolicitudesCount(solicitudes || 0);
    setVehiculosRefCount(vehiculos || 0);
    setChatbotCount(chatbots || 0); // ✅ Nuevo
    setGraficoEvaluaciones(dataGrafico);
  };

  if (cargando) {
    return <div className="p-10 text-center text-gray-600 text-lg">Cargando datos...</div>;
  }

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Panel de Control Administrativo</h1>

      {/* Menú de navegación */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={() => router.push("/admin")} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
          Dashboard
        </button>
        <button onClick={() => router.push("/admin/evaluaciones")} className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow">
          Evaluaciones
        </button>
        <button onClick={() => router.push("/admin/solicitudes")} className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow">
          Solicitudes
        </button>
        <button onClick={() => router.push("/admin/referencia")} className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow">
          Referencias
        </button>
        {/* ✅ Nuevo botón para solicitudes de chatbot */}
        <button onClick={() => router.push("/admin/chatbotsolicitudes")} className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow">
          Solicitudes Chatbot
        </button>

        {/* Botón de cerrar sesión */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/admin/login");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow ml-auto"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6 border text-center">
          <h2 className="text-lg font-semibold text-gray-700">Evaluaciones Realizadas</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{evaluacionesCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border text-center">
          <h2 className="text-lg font-semibold text-gray-700">Solicitudes de Vehículo</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{solicitudesCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border text-center">
          <h2 className="text-lg font-semibold text-gray-700">Referencias en Base de Datos</h2>
          <p className="text-4xl font-bold text-orange-600 mt-2">{vehiculosRefCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border text-center">
          <h2 className="text-lg font-semibold text-gray-700">Interesados en Chatbot</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">{chatbotCount}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow p-6 border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Evaluaciones por Fecha</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graficoEvaluaciones}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
