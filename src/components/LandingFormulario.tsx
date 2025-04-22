"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LandingFormulario() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    tipo: "",
    marca: "",
    ciudad: "",
    anioMin: "",
    anioMax: "",
    precioMin: "",
    precioMax: "",
    combustible: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje("Enviando datos...");

    const { data, error } = await supabase.from("solicitudes_ofertas").insert([form]);

    if (error) {
      console.error("Error al guardar en Supabase:", error);
      setMensaje("❌ Error al enviar el formulario");
    } else {
      setMensaje("✅ ¡Formulario enviado con éxito!");
      setForm({
        nombre: "",
        email: "",
        whatsapp: "",
        tipo: "",
        marca: "",
        ciudad: "",
        anioMin: "",
        anioMax: "",
        precioMin: "",
        precioMax: "",
        combustible: ""
      });
    }
    setEnviando(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-lime-50 to-green-100 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl border">
        <h1 className="text-2xl font-bold text-center text-[#006654] mb-6">
          ¿Qué vehículo estás buscando?
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          Recibe ofertas únicas y directas en tu WhatsApp, sin intermediarios.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nombre" value={form.nombre} onChange={handleChange} type="text" placeholder="Tu nombre" className="input" />
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Tu email" className="input" />
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} type="tel" placeholder="Tu WhatsApp" className="input" />
            <input name="ciudad" value={form.ciudad} onChange={handleChange} type="text" placeholder="Ciudad" className="input" />
            <select name="tipo" value={form.tipo} onChange={handleChange} className="input">
              <option value="">Tipo de vehículo</option>
              <option value="auto">Auto</option>
              <option value="camioneta">Camioneta</option>
              <option value="suv">SUV</option>
              <option value="moto">Moto</option>
            </select>
            <input name="marca" value={form.marca} onChange={handleChange} type="text" placeholder="Marca deseada" className="input" />
            <input name="anioMin" value={form.anioMin} onChange={handleChange} type="number" placeholder="Año mínimo" className="input" />
            <input name="anioMax" value={form.anioMax} onChange={handleChange} type="number" placeholder="Año máximo" className="input" />
            <input name="precioMin" value={form.precioMin} onChange={handleChange} type="number" placeholder="Precio mínimo" className="input" />
            <input name="precioMax" value={form.precioMax} onChange={handleChange} type="number" placeholder="Precio máximo" className="input" />
            <select name="combustible" value={form.combustible} onChange={handleChange} className="input">
              <option value="">Tipo de combustible</option>
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diésel</option>
              <option value="electrico">Eléctrico</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
          <button type="submit" disabled={enviando} className="w-full bg-[#006654] text-white py-3 rounded-xl hover:bg-[#007f6d] transition-all">
            {enviando ? "Enviando..." : "Enviar y recibir ofertas 🚘"}
          </button>
          {mensaje && <p className="text-center text-sm text-gray-600 mt-2">{mensaje}</p>}
        </form>
      </div>
    </main>
  );
}
