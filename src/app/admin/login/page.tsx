"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError("Credenciales incorrectas. Intenta nuevamente.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600">
  <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
      <img src="/logor.png" alt="Logo Tiendago" className="mx-auto mb-4 w-20 rounded-xl shadow" />

        <h1 className="text-xl font-bold text-gray-800 mb-6">RuedaJusta</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
         <button
  type="submit"
  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 mt-4"
>
  Iniciar sesión
</button>

        </form>

        {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}
