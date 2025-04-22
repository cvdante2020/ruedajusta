'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [mostrarCerrar, setMostrarCerrar] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const rutasProtegidas = ["/admin", "/admin/evaluaciones", "/admin/referencia", "/admin/solicitudes"];
    setMostrarCerrar(rutasProtegidas.some((ruta) => pathname?.startsWith(ruta)));
  }, [pathname]);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <div className="flex items-center gap-2">
        <img src="/logor.png" alt="RuedaJusta" className="h-10" />
        <span className="font-bold text-lg text-gray-800">RuedaJusta</span>
      </div>

      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
        <Link href="/evaluacion" className="hover:text-blue-600 transition">Evaluar</Link>
        <Link href="/formulario" className="hover:text-blue-600 transition">Buscas un auto?</Link>
        <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>
      </nav>

      {mostrarCerrar ? (
        <button
          onClick={cerrarSesion}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      ) : (
        <Link
          href="/evaluacion"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          ¡Empieza ahora!
        </Link>
      )}
    </header>
  );
}
