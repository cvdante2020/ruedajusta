import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const testData = {
    nombre: "Carlos",
    apellido: "Mora",
    ciudad: "Guayaquil",
    Marca: "KIA",
    modelo: "SOUL",
    anio: 2020,
  };

  // WhatsApp
  const whatsappPayload = {
    messaging_product: "whatsapp",
    to: "593998260550", // ✅ tu número personal en formato internacional
    type: "template",
    template: {
      name: "hello_world",
      language: { code: "en_US" },
    },
  };

  const whatsappRes = await fetch(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(whatsappPayload),
    }
  );

  const whatsappResult = await whatsappRes.json();

  // Email
  const emailResult = await resend.emails.send({
    from: "RuedaJusta <onboarding@resend.dev>",
    to: "sis.christian.villarreal@gmail.com", // <- reemplázalo con tu email personal
    subject: "🚘 Nueva evaluación recibida en RuedaJusta",
    html: `
      <p><strong>Nombre:</strong> ${testData.nombre} ${testData.apellido}</p>
      <p><strong>Ciudad:</strong> ${testData.ciudad}</p>
      <p><strong>Vehículo:</strong> ${testData.Marca} ${testData.modelo} (${testData.anio})</p>
    `,
  });

  return NextResponse.json({
    status: "Prueba enviada",
    whatsapp: whatsappResult,
    email: emailResult,
  });
}
