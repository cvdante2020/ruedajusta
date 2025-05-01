// /app/api/notificar-busqueda/route.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, celular, email, ciudad, marca, modelo, anio } = body;

  // Enviar email al administrador
  const emailResult = await resend.emails.send({
    from: "RuedaJusta <onboarding@resend.dev>",
    to: "sis.christian.villarreal@gmail.com", 
    subject: "🔍 Nueva búsqueda de vehículo en RuedaJusta",
    html: `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Ciudad:</strong> ${ciudad}</p>
      <p><strong>Celular:</strong> ${celular}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Busca:</strong> ${marca} ${modelo} ${anio}</p>
    `,
  });

  // Enviar WhatsApp con plantilla personalizada
  const whatsappPayload = {
    messaging_product: "whatsapp",
    to: "593998260550", // tu número o uno de prueba autorizado
    type: "template",
    template: {
      name: "busqueda_vehiculo",
      language: { code: "es_EC" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: nombre },
            { type: "text", text: ciudad },
            { type: "text", text: marca },
            { type: "text", text: modelo },
            { type: "text", text: anio.toString() },
          ],
        },
      ],
    },
  };

  const whatsappRes = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(whatsappPayload),
  });

  const whatsappResult = await whatsappRes.json();

  return Response.json({ status: "ok", emailResult, whatsapp: whatsappResult });
}
