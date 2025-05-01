// src/components/LandingFormulario.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LandingFormulario() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    ciudad: "",
    marca: "",
    modelo: "",
    tipo: "",
    anioMin: "",
    anioMax: "",
    precioMin: "",
    precioMax: "",
    combustible: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);
  const [modelosDisponibles, setModelosDisponibles] = useState<string[]>([]);
  const [tiposPorModelo, setTiposPorModelo] = useState<Record<string, string>>({});

  // Cargar marcas al iniciar
  useEffect(() => {
    const cargarMarcas = async () => {
      const { data, error } = await supabase
        .from("marcas_modelos")
        .select("marca")
        .order("marca", { ascending: true });

      if (data) {
        const marcasUnicas = [...new Set(data.map((item) => item.marca.trim()))];
        setMarcasDisponibles(marcasUnicas);
      } else {
        console.error("Error al cargar marcas:", error);
      }
    };
    cargarMarcas();
  }, []);

  // Cargar modelos y tipo al seleccionar marca
  useEffect(() => {
    const cargarModelos = async () => {
      if (!form.marca) return;

      const { data, error } = await supabase
        .from("marcas_modelos")
        .select("modelo, tipo_vehiculo")
        .eq("marca", form.marca);

      if (data) {
        const modelosUnicos = [...new Set(data.map((item) => item.modelo.trim()))];
        const tipoMap = Object.fromEntries(data.map((item) => [item.modelo.trim(), item.tipo_vehiculo.trim()]));
        setModelosDisponibles(modelosUnicos);
        setTiposPorModelo(tipoMap);
      } else {
        console.error("Error al cargar modelos:", error);
      }
    };

    cargarModelos();
  }, [form.marca]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "modelo") {
      setForm({
        ...form,
        modelo: value,
        tipo: tiposPorModelo[value] || "",
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.nombre)) {
      alert("El nombre solo debe contener letras."); return;
    }
    if (!/^\d{1,10}$/.test(form.whatsapp)) {
      alert("El WhatsApp debe contener solo números y máximo 10 dígitos."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("El correo ingresado no es válido."); return;
    }
    if (form.ciudad.length > 20) {
      alert("La ciudad no debe tener más de 20 caracteres."); return;
    }
    const anioMin = parseInt(form.anioMin);
    const anioMax = parseInt(form.anioMax);
    if (isNaN(anioMin) || anioMin < 1980 || anioMin > 2024) {
      alert("El año mínimo debe estar entre 1980 y 2024."); return;
    }
    if (isNaN(anioMax) || anioMax < 2000 || anioMax > 2025) {
      alert("El año máximo debe estar entre 2000 y 2025."); return;
    }
    const precioMin = parseInt(form.precioMin);
    const precioMax = parseInt(form.precioMax);
    if (
      isNaN(precioMin) || precioMin < 5000 || precioMin > 200000 ||
      isNaN(precioMax) || precioMax < 5000 || precioMax > 200000
    ) {
      alert("Los precios deben estar entre $5.000 y $200.000."); return;
    }

    setEnviando(true);
    setMensaje("Enviando datos...");

    const { error } = await supabase.from("solicitudes_ofertas").insert([form]);
    if (error) {
      console.error(error);
      setMensaje("❌ Error al enviar el formulario");
    } else {
      setMensaje("✅ ¡Formulario enviado con éxito!");
      setTimeout(() => router.push("/"), 1500);
    }

    setEnviando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#006654]">¿Qué vehículo estás buscando?</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Recibe <strong>ofertas únicas</strong> y <strong>directas</strong> en tu WhatsApp, <span className="text-green-600 font-semibold">¡sin intermediarios!</span>
        </p>
      </div>

      <input name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} className="input" required />
      <input name="email" placeholder="Tu correo" value={form.email} onChange={handleChange} className="input" type="email" required />
      <input name="whatsapp" placeholder="Tu WhatsApp" value={form.whatsapp} onChange={handleChange} className="input" inputMode="numeric" required />
      <input name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} className="input" required />

      <select name="marca" value={form.marca} onChange={handleChange} className="input" required>
        <option value="">Marca deseada</option>
        {marcasDisponibles.map((marca) => (
          <option key={marca} value={marca}>{marca}</option>
        ))}
      </select>

      {form.marca && (
        <select name="modelo" value={form.modelo} onChange={handleChange} className="input" required>
          <option value="">Modelo deseado</option>
          {modelosDisponibles.map((modelo) => (
            <option key={modelo} value={modelo}>{modelo}</option>
          ))}
        </select>
      )}

      {form.modelo && tiposPorModelo[form.modelo] && (
        <div className="input bg-gray-100 text-gray-700 cursor-not-allowed">
          Tipo: {tiposPorModelo[form.modelo]}
        </div>
      )}

      <input name="anioMin" placeholder="Año mínimo" value={form.anioMin} onChange={handleChange} className="input" type="number" required />
      <input name="anioMax" placeholder="Año máximo" value={form.anioMax} onChange={handleChange} className="input" type="number" required />
      <input name="precioMin" placeholder="Precio mínimo" value={form.precioMin} onChange={handleChange} className="input" type="number" required />
      <input name="precioMax" placeholder="Precio máximo" value={form.precioMax} onChange={handleChange} className="input" type="number" required />

      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-xl w-full">
        {enviando ? "Enviando..." : "Enviar y recibir ofertas 🚘"}
      </button>
      {mensaje && <p className="text-center text-sm text-gray-600 mt-2">{mensaje}</p>}
    </form>
  );
}
