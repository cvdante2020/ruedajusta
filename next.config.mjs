
const nextConfig = {

  
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint en el build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora errores de TypeScript en el build
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "peagwiiqairbmnpbxtdb.supabase.co" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "images-eu.ssl-images-amazon.com" },
      
      // agrega otros dominios si usarás externos
    ],
  },

}


export default nextConfig
