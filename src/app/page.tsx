'use client';
import Script from "next/script"; 
import Header from "@/components/Header";
import PublicidadFlotante from "@/components/PublicidadFlotante";
import PublicidadSphaera from "@/components/PublicidadSphaera";
import MiniAdsFromDB from "@/components/MiniAdsFromDB";
import AmazonMiniAds from "@/components/AmazonMiniAds"; // ✅ sin llaves
// ❌ NO: import { AmazonMiniAds } from "@/components/AmazonMiniAds";


import {
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

const productosDerecha = [
    {
      nombre: "Luuzkla Batería de 19800 mAh, compatible con iPhone 12/12 Pro",
      url: "https://amzn.to/4oxbR7l",
      img: "/bat.jpg",
    },
    {
      nombre: "Suero para el Acné",
      url: "https://amzn.to/4oxgApB",
      img: "/su1.jpg",
    },
  ];

  const productosIzquierda = [
    {
      nombre: "Luz LED para escritorio gamer",
      url: "https://amzn.to/48EdsUl",
      img: "/amazon3.jpg",
    },
    {
      nombre: "Teclado mecánico retroiluminado",
      url: "https://amzn.to/4bYYabc",
      img: "/amazon4.jpg",
    },
  ];

export default function Home() {
  return (
    
    <>
    {/* === JSON-LD: Organization === */}
      <Script id="schema-org-organization" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "RuedaJusta",
            "url": "https://ruedajusta.com",
            "logo": "https://ruedajusta.com/icon.ico",
            "description": "Evaluación y ofertas personalizadas de vehículos en Ecuador",
            "areaServed": "EC"
          })
        }}
      />

       <Script id="schema-org-website" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "RuedaJusta",
            "url": "https://ruedajusta.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ruedajusta.com/buscar?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

       <Script id="schema-org-service" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Evaluación de vehículos en Ecuador",
            "serviceType": "Vehicle appraisal",
            "provider": { "@type": "Organization", "name": "RuedaJusta" },
            "areaServed": "EC",
            "url": "https://ruedajusta.com/evaluacion",
            "description": "Calcula el valor real de tu auto en Ecuador con datos del mercado.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />
      <Header />
      
      {/* HERO */}
      <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 pt-32 pb-20 text-center">
        <div className="animate-fade-up transition-all duration-500">
          <img
            src="car.jpg"
            alt="Evaluación de vehículo"
            className="w-full max-w-md mx-auto mb-8 rounded-2xl shadow-lg"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Evalúa el precio justo de tu vehículo en Ecuador
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            En RuedaJusta combatimos la desinformación del mercado automotor. Calcula el valor real de tu auto sin caer en trampas de precios manipulados por intermediarios.
          </p>
          <a
            href="/evaluacion"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition transform duration-300"
          >Evaluar mi vehículo ahora
          </a>
        </div>
      </main>
        <MiniAdsFromDB posicion="right" />
      <MiniAdsFromDB posicion="left" />
      <PublicidadFlotante />
      <PublicidadSphaera />
            {/* ¿POR QUÉ? */}
      <section id="por-que" className="bg-gray-50 py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ¿Por qué nace RuedaJusta?
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            En Ecuador, el mercado automotor se ha visto distorsionado por comerciantes e intermediarios que manipulan los precios de los vehículos. Esta práctica ha generado desinformación y ha afectado tanto a compradores como a vendedores.
          </p>
          <p className="text-lg text-gray-700">
            RuedaJusta nace para romper con esta tendencia. Nuestra misión es brindar transparencia, objetividad y una evaluación imparcial del valor real de cada vehículo, utilizando datos, tecnología y análisis confiable.
          </p>
        </div>
      </section>
      {/* CÓMO FUNCIONA */}
          <section id="como-funciona" className="bg-white py-20 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            ¿Cómo funciona RuedaJusta?
            
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl shadow-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">1. Ingresas los datos de tu vehículo</h3>
              <p className="text-gray-700">
                Marca, modelo, año, kilometraje y estado. Toda la información clave para una evaluación precisa.
              </p>
            </div>
            <div className="p-6 border rounded-xl shadow-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">2. Analizamos con inteligencia de datos</h3>
              <p className="text-gray-700">
                Comparamos tu auto con miles de vehículos similares en tiempo real para identificar su valor justo.
              </p>
            </div>
            <div className="p-6 border rounded-xl shadow-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">3. Recibes un precio justo y confiable</h3>
              <p className="text-gray-700">
                Obtienes un rango de precio realista para vender, comprar o negociar tu vehículo con seguridad.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-100 py-20 px-6 text-center">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
      ¿Qué hace única a RuedaJusta?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <ChartBarIcon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Análisis inteligente</h3>
        <p className="text-gray-600">
          Nuestro sistema compara datos reales del mercado para ofrecerte una valoración exacta y confiable.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <Cog6ToothIcon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Proceso técnico</h3>
        <p className="text-gray-600">
          Aplicamos criterios del reglamento RTE INEN 034-048-136 para evaluar cada componente del vehículo.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <ShieldCheckIcon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Transparencia total</h3>
        <p className="text-gray-600">
          Olvídate de especulación y manipulaciones. Aquí obtienes el valor justo de tu vehículo sin rodeos.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* CTA FINAL */}
      <section id="contacto" className="bg-blue-600 py-20 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Buscas un Vehículo?
          </h2>
          <p className="text-lg mb-8">
            Nosotros lo hacemos por ti. Sin intermediarios, dejanos tus datos y habla directamente con el dueño....
          </p>
          <a
            href="formulario"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl text-lg transition-all duration-200 hover:bg-gray-100"
          > Buscar mi Carro
          </a>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-300 py-10 px-6 text-center">
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-lg font-bold text-white">RuedaJusta</div>
      <nav className="flex flex-wrap gap-4 text-sm">
        <a href="#inicio" className="hover:text-white">Inicio</a>
        <a href="#por-que" className="hover:text-white">¿Por qué?</a>
        <a href="#como-funciona" className="hover:text-white">Cómo funciona</a>
        <a href="/evaluacion" className="hover:text-white">Evaluar mi vehículo</a>
      </nav>
      
    </div>
    <hr className="my-6 border-gray-700" />
    <p className="text-sm">&copy; {new Date().getFullYear()} RuedaJusta. Todos los derechos reservados.</p>
  </div>
</footer>

    </>
  );
}
