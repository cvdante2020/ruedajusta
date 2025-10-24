// components/PublicidadSphaera.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

const SPHAERA_URL = "https://sphaera.club/";
const IMG_SRC = "/redes.png"; // coloca tu imagen dentro de /public

export default function PublicidadSphaera() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Aparece a los 3 segundos y se oculta a los 6 minutos
    const showTimer = setTimeout(() => setVisible(true), 3000);
    const hideTimer = setTimeout(() => setVisible(false), 6 * 60 * 1000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const goToSphaera = () => {
    window.open(SPHAERA_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-6 z-50 w-80 cursor-pointer select-none"
          onClick={goToSphaera}
          aria-label="Publicidad: Ir a Sphaera Club"
          role="button"
        >
          <div className="overflow-hidden rounded-2xl shadow-2xl bg-white">
            {/* Imagen superior */}
            <div className="relative h-44 w-full">
              <Image
                src={IMG_SRC}
                alt="Impulsa tus redes sociales con Sphaera"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 20vw"
                className="object-cover"
              />
            </div>

            {/* Cuerpo / Copy */}
            <div className="p-4 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
              <h4 className="text-lg font-bold leading-tight">
                ¡Haz Crecer tus Redes!
              </h4>
              <p className="mt-1 text-sm opacity-95">
                Aumenta tus seguidores, likes y comentarios en TikTok, Instagram, X, Facebook y LinkedIn
                Con Sphaera crece tu visibilidad y llega a más personas sin complicaciones.
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSphaera();
                }}
                className="mt-3 w-full rounded-xl bg-white px-4 py-2 font-semibold text-blue-600 shadow hover:bg-gray-100 transition"
              >
                🌟 Ir a Sphaera.club
              </button>
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVisible(false);
            }}
            className="absolute -top-2 -right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/85"
            aria-label="Cerrar publicidad"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
