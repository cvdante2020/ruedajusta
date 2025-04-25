"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ChatbotInteresado {
  id: number;
  nombre: string;
  celular: string;
  email: string;
  negocio: string;
  comentario: string;
  created_at: string;
}

export default function ChatbotAdmin() {
  const [interesados, setInteresados] = useState<ChatbotInteresado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("chatbot_interesados")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error cargando interesados:", error);
      } else {
        setInteresados(data || []);
      }
      setCargando(false);
    };

    fetchData();
  }, []);

  if (cargando) {
    return <div className="p-10 text-center text-gray-600">Cargando interesados...</div>;
  }

  return (
    <main className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Chatbot</h1>
      {interesados.length === 0 ? (
        <div className="text-center text-gray-500">No hay interesados aún.</div>
      ) : (
        <div className="overflow-auto rounded-lg shadow bg-white p-6">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Celular</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Negocio</th>
                <th className="px-4 py-2">Comentario</th>
                <th className="px-4 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {interesados.map((i) => (
                <tr key={i.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{i.nombre}</td>
                  <td className="px-4 py-2">{i.celular}</td>
                  <td className="px-4 py-2">{i.email}</td>
                  <td className="px-4 py-2">{i.negocio}</td>
                  <td className="px-4 py-2">{i.comentario}</td>
                  <td className="px-4 py-2">{new Date(i.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
