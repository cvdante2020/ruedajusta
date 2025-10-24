import type { NextConfig } from 'next'

const nextConfig: NextConfig = {

  
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint en el build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora errores de TypeScript en el build
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      // agrega otros dominios si usarás externos
    ],
  },
  
}


export default nextConfig
