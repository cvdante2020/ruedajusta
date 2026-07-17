import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ruedajusta.com"),
  title: "RuedaJusta | Compra y vende vehículos directo, sin comisiones · Ecuador",
  description:
    "Publica y vende tu vehículo, o busca uno y recibe ofertas instantáneas. Chatea directo y cierra el trato. Sin comisiones ni intermediarios.",
  openGraph: {
    title: "RuedaJusta — El trato directo",
    description:
      "Publica y vende tu vehículo, o busca uno y recibe ofertas instantáneas. Sin comisiones. Ecuador.",
    url: "https://ruedajusta.com",
    siteName: "RuedaJusta",
    locale: "es_EC",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
