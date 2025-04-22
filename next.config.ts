import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora errores de ESLint en el build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora errores de TypeScript en el build
  },
}

export default nextConfig
