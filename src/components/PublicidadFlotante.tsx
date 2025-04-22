// components/PublicidadChatbot.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";


export default function PublicidadChatbot() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 360000); // se oculta 10 seg después
  
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xl rounded-2xl p-5 w-80 z-50"
        >
        
          <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Bot className="w-8 h-8 animate-bounce" />
          <div>
            <h4 className="text-lg font-bold mb-1">¡Crea tu Chatbot Hoy!</h4>
            <p className="text-sm">
              Integra un asistente inteligente en tu sitio web y negocio en minutos . Mejora la atención y ventas por tan solo 49,99 USD mensual🚀
            </p>
           {/* Botón CTA */}
        <a href="/chatbot" className="block w-full text-center ...">
         ¡Quiero mi Chatbot!
        </a>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-3 text-white hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
