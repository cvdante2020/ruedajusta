// src/app/chatbot.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ChatbotLanding() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    celular: "",
    email: "",
    negocio: "",
    comentario: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (enviado) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [enviado, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.nombre);
    if (!nombreValido) {
      alert("El nombre solo debe contener letras.");
      return;
    }

    const celularValido = /^\d{10}$/.test(form.celular);
    if (!celularValido) {
      alert("El celular debe tener exactamente 10 dígitos (Ej: 0998277888).");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailValido) {
      alert("El correo ingresado no es válido.");
      return;
    }

    if (form.comentario.trim() === "") {
      alert("Por favor cuéntanos sobre tu negocio.");
      return;
    }

    const { error } = await supabase.from("chatbot_interesados").insert([form]);
    if (!error) setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-4">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-brand-primary">¡Queremos conocerte!</h1>
        <p className="mb-6 text-gray-600">Completa este formulario y en 72 horas tendrás tu chatbot activo.</p>

        {enviado ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold text-lg mb-2">✅ ¡Gracias!</p>
            <p className="text-gray-700">Un ejecutivo se pondrá en contacto contigo. Serás redirigido automáticamente...</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="nombre"
              required
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border"
            />
            <input
              name="celular"
              required
              placeholder="Tu celular"
              value={form.celular}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Tu correo"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border"
            />
            <select
              name="negocio"
              required
              value={form.negocio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded bg-white text-gray-700"
            >
              <option value="">Selecciona tu tipo de negocio</option>
              <option value="Venta de autos">Venta de autos</option>
              <option value="Panadería">Panadería</option>
              <option value="Tienda de Ropa">Tienda de Ropa</option>
              <option value="Consultorio Dental">Consultorio Dental</option>
              <option value="Consultorio Médico">Consultorio Médico</option>
              <option value="Otros">Otros</option>
            </select>
            <textarea
              name="comentario"
              placeholder="Cuéntanos con mucho detalle tu negocio"
              rows={3}
              value={form.comentario}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded w-full"
            >
              Enviar formulario 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
